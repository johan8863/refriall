"""finance views"""

# third
from rest_framework import viewsets

# local
from .models import Order, ItemTime
from .serializers import OrderSerializer, ItemTimeSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer


class ItemTimeViewSet(viewsets.ModelViewSet):
    queryset = ItemTime.objects.all()
    serializer_class = ItemTimeSerializer