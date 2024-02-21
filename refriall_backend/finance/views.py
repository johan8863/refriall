"""finance views"""

# django
from django.db.models import Q
from django.http import Http404

# third
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination

# local
from .models import Order, Bill
from .serializers import BillSerializer, BillSerializerForReadOnly, BillSerializerDetailUpdate, OrderSerializerForReadOnly, OrderSerializer


class BillList(APIView, PageNumberPagination):
    def get(self, request, format=None):
        bills = Bill.objects.all()
        results = self.paginate_queryset(bills, request, view=self)
        serializer = BillSerializerForReadOnly(results, many=True)
        return self.get_paginated_response(serializer.data)


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


class BillDetailUpdate(APIView):
    def get_object(self, pk):
        try:
            return Bill.objects.get(pk=pk)
        except Bill.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        bill = self.get_object(pk=pk)
        serializer = BillSerializerDetailUpdate(bill)
        return Response(serializer.data)


# class BillUpdate(APIView):
#     def get_object(self, pk):
#         try:
#             return Bill.objects.get(pk=pk)
#         except Bill.DoesNotExist:
#             raise Http404

#     def put(self, request, pk, format=None):
#         bill = self.get_object(pk)
#         serializer = BillSerializerUpdate(bill, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class OrderList(APIView, PageNumberPagination):
    def get(self, request, format=None):
        orders = Order.objects.all()
        results = self.paginate_queryset(orders, request, view=self)
        serializer = OrderSerializerForReadOnly(results, many=True)
        return self.get_paginated_response(serializer.data)


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


class OrderFromCustomerNotMatched(APIView):
    """returns all orders related to the given customer id and matched=False"""
    def get(self, request, pk, format=None):
        orders = Order.objects.filter(Q(customer=pk) | Q(customer_dependency__customer=pk), Q(bill=None))
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)


class OrderFromCustomer(APIView):
    """returns all orders related to the given customer id"""
    def get(self, request, pk, format=None):
        orders = Order.objects.filter(Q(customer=pk) | Q(customer_dependency__customer=pk))
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)


class OrderNotMatched(APIView):
    """returns all orders with matched=False, e.g free to be matched"""
    def get(self, request, format=None):
        orders = Order.objects.filter(bill=None)
        serializer = OrderSerializerForReadOnly(orders, many=True)
        return Response(serializer.data)