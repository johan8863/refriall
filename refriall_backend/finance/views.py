"""finance views"""

# django
from django.db.models import Q
from django.http import Http404

# third
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

# local
from .models import Order, Bill
from .serializers import BillSerializer, BillSerializerForReadOnly, OrderSerializerForReadOnly, OrderSerializer


class BillList(APIView):
    def get(self, request, format=None):
        bills = Bill.objects.all()
        serializer = BillSerializerForReadOnly(bills, many=True)
        return Response(serializer.data)


class BillDetail(APIView):
    def get_object(self, pk):
        try:
            return Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        bill = self.get_object(pk=pk)
        serializer = BillSerializerForReadOnly(bill)
        return Response(serializer.data)


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


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


class OrderFromClient(APIView):
    """returns all orders related to the given customer id"""
    def get(self, request, pk, format=None):
        orders = Order.objects.filter(Q(customer=pk) | Q(customer_dependency__customer=pk), Q(matched=False))
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)


class OrderNotMatched(APIView):
    """returns all orders with matched=False, e.g free to be matched"""
    def get(self, request, format=None):
        orders = Order.objects.filter(matched=False)
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)