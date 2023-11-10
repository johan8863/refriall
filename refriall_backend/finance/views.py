"""finance views"""

# third
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

# local
from .models import Order, ItemTime
from .serializers import OrderSerializerForReadOnly, OrderSerializer


class OrderList(APIView):
    def get(self, request, format=None):
        orders = Order.objects.all()
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)
    

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer