"""finance views"""

# third
from rest_framework import viewsets

# local
from .models import Order, ItemTime
from .serializers import OrderSerializerForReadOnly, OrderSerializer


class OrderViewSetReadOnly(viewsets.ReadOnlyModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializerForReadOnly

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer