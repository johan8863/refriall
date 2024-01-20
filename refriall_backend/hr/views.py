"""finence views"""

# third
from rest_framework import viewsets

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import CustomerSerializer, ProviderSerializer, CustomerDependencySerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer


class CustomerDependencyViewSet(viewsets.ModelViewSet):
    queryset = CustomerDependency.objects.all()
    serializer_class = CustomerDependencySerializer