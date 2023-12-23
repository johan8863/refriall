"""finance views"""

# django
from django.http import Http404

# third
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

# local
from .models import Order
from .serializers import OrderSerializerForReadOnly, OrderSerializer


class OrderList(APIView):
    def get(self, request, format=None):
        orders = Order.objects.all()
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)


class OrderDetail(APIView):
    def get_object(self, pk):
        try:
            return Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            raise Http404
    
    def get(self, request, pk, format=None):
        order = self.get_object(pk)
        serializer = OrderSerializerForReadOnly(order)
        return Response(serializer.data)
    

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer