"""finence views"""

# third
from rest_framework import viewsets

# local
from .models import Customer, Provider
from .serializers import CustomerSerializer, ProviderSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer