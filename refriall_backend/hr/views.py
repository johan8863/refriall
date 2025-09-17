"""hr views"""

# django
from django.http import Http404
from django.db.models import Q
from django.db.models.deletion import ProtectedError

# third
from rest_framework import filters, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import (
    CustomerSerializer,
    CustomerSerializerDetail,
    ProviderSerializerRead,
    ProviderSerializerWrite,
    CustomerDependencySerializer
)
from .paginators import CustomerPagination, ProviderPagination
from finance.models import Order


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            customer_pk = kwargs['pk']
            customer = Customer.objects.get(pk=customer_pk)
            return Response(
                data={
                    'customer': CustomerSerializer(customer).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class CustomerListPagination(APIView, CustomerPagination):
    def get(self, request, format=None):
        customers = Customer.objects.all()
        
        # Search y 'search' parameter is included
        search_term = request.query_params.get('search', None)
        if search_term:
            customers = customers.filter(name__icontains=search_term)
        
        results = self.paginate_queryset(customers, request, view=self)
        serializer = CustomerSerializerDetail(results, many=True)
        return self.get_paginated_response(serializer.data)


class CustomerDetail(APIView):
    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        customer = self.get_object(pk=pk)
        serializer = CustomerSerializerDetail(customer)
        return Response(serializer.data)


class CustomerOrderCurrencyNoBill(APIView):
    """Return all customers with orders without bills with the received currency"""
    def get(self, request, currency, format=None):
        orders_without_bill = Order.objects.filter(bill__isnull=True, currency=currency)
        unique_customers = orders_without_bill.values('customer').distinct()
        unique_customer_dependencies = orders_without_bill.values('customer_dependency').distinct()
        customers = Customer.objects.filter(Q(id__in=unique_customers) | Q(dependencies__in=unique_customer_dependencies)).distinct()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)



class ProviderListPagination(APIView, ProviderPagination):
    def get(self, request, format=None):
        providers = Provider.objects.all()
        results = self.paginate_queryset(providers, request, view=self)
        serializer = ProviderSerializerRead(results, many=True)
        return self.get_paginated_response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializerRead

    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ProviderSerializerWrite
        return super().get_serializer_class()


class CustomerDependencyViewSet(viewsets.ModelViewSet):
    queryset = CustomerDependency.objects.all()
    serializer_class = CustomerDependencySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'customer__name']

    def get_queryset(self):
        queryset = CustomerDependency.objects.all()
        customer_id = self.request.query_params.get('customer', None)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            dependency_pk = kwargs['pk']
            dependency = CustomerDependency.objects.get(pk=dependency_pk)
            return Response(
                data={
                    'dependency': CustomerDependencySerializer(dependency).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )