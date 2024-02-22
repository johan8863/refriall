"""finence views"""

# third
from rest_framework import viewsets
from rest_framework.views import APIView

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import CustomerSerializer, ProviderSerializer, CustomerDependencySerializer
from .paginators import CustomerPagination


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class CustomerListPagination(APIView, CustomerPagination):
    def get(self, request, format=None):
        customers = Customer.objects.all()
        results = self.paginate_queryset(customers, request, view=self)
        serializer = CustomerSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer


class CustomerDependencyViewSet(viewsets.ModelViewSet):
    queryset = CustomerDependency.objects.all()
    serializer_class = CustomerDependencySerializer