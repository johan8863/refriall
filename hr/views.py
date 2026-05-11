"""hr views"""

# django
from django.http import Http404
from django.db.models import Q
from django.db.models.deletion import ProtectedError

# third
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import (
    CustomerSerializer,
    CustomerSerializerDetail,
    ProviderCreateSerializer,
    ProviderUpdateSerializer,
    ProviderPasswordUpdateSerializer,
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


class CustomerOrderCurrencyProviderNoBill(APIView):
    """Return all customers with orders without bills with the received currency"""
    def get(self, request, currency_pk, provider_pk, format=None):
        orders_without_bill = Order.objects.filter(bill__isnull=True, currency=currency_pk, provider=provider_pk)
        unique_customers = orders_without_bill.values('customer').distinct()
        unique_customer_dependencies = orders_without_bill.values('customer_dependency').distinct()
        customers = Customer.objects.filter(Q(id__in=unique_customers) | Q(dependencies__in=unique_customer_dependencies)).distinct()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)



class ProviderOrderCurrencyNoBill(APIView):
    """Returns all Providers with orders free to match in a bill given a currency"""
    def get(self, request, currency, format=None):
        orders_without_bill = Order.objects.filter(bill__isnull=True, currency=currency)
        unique_providers = orders_without_bill.values('provider').distinct()
        providers = Provider.objects.filter(id__in=unique_providers)
        serializer = ProviderUpdateSerializer(providers, many=True)
        return Response(serializer.data)



class ProviderListPagination(APIView, ProviderPagination):
    def get(self, request, format=None):
        providers = Provider.objects.all()
        results = self.paginate_queryset(providers, request, view=self)
        serializer = ProviderUpdateSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderUpdateSerializer

    def get_serializer_class(self):
        """
        Returns different serializers based on the actions
        """
        if self.action == 'create':
            return ProviderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProviderUpdateSerializer
        return ProviderUpdateSerializer
    
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            provider_pk = kwargs['pk']
            provider = Provider.objects.get(pk=provider_pk)
            return Response(
                data=ProviderUpdateSerializer(provider),
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """
        Custom endpoint for users to change their own password.
        POST /api/providers/change-password/
        """
        serializer = ProviderPasswordUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Contraseña actualizada correctamente."}, 
            status=status.HTTP_200_OK
        )


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