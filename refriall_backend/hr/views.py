"""finence views"""

# django
from django.http import Http404

# third
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import CustomerSerializer, CustomerSerializerDetail, ProviderSerializer, CustomerDependencySerializer
from .paginators import CustomerPagination, ProviderPagination


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerListPagination(APIView, CustomerPagination):
    def get(self, request, format=None):
        customers = Customer.objects.all()
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



class ProviderListPagination(APIView, ProviderPagination):
    def get(self, request, format=None):
        providers = Provider.objects.all()
        results = self.paginate_queryset(providers, request, view=self)
        serializer = ProviderSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer


class CustomerDependencyViewSet(viewsets.ModelViewSet):
    queryset = CustomerDependency.objects.all()
    serializer_class = CustomerDependencySerializer