"""finance views"""

# django
from django.db.models import Q
from django.db.models.deletion import ProtectedError
from django.http import Http404

# third
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

# local
from .models import Bill, Currency, Order
from .serializers import BillSerializer, BillSerializerForReadOnly, BillSerializerDetailUpdate, CurrencySerializer, OrderSerializerForReadOnly, OrderSerializer
from .paginators import BillPagination, OrderPagination


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            currency_pk = kwargs['pk']
            currency = Currency.objects.get(pk=currency_pk)
            return Response(
                data={
                    'currency': CurrencySerializer(currency).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )



class BillListPagination(APIView, BillPagination):
    def get(self, request, format=None):
        bills = Bill.objects.all()
        
        # Search by folio or customer name
        search_term = request.query_params.get('search', None)
        if search_term:
            bills = bills.filter(
                Q(folio__icontains=search_term) |
                Q(customer__name__icontains=search_term)
            )
        
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


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer


class OrderListPagination(APIView, OrderPagination):
    def get(self, request, format=None):
        orders = Order.objects.all()
        
        # Search by folio, customer name or dependency
        search_term = request.query_params.get('search', None)
        if search_term:
            orders = orders.filter(
                Q(folio__icontains=search_term) |
                Q(customer__name__icontains=search_term) |
                Q(customer_dependency__name__icontains=search_term)
            )
        
        results = self.paginate_queryset(orders, request, view=self)
        serializer = OrderSerializerForReadOnly(results, many=True)
        return self.get_paginated_response(serializer.data)


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


class OrderFromCustomerNotMatched(APIView):
    """returns all orders related to the given customer id and bill__isnull=True"""
    def get(self, request, pk, currency, format=None):
        orders = Order.objects.filter(Q(customer=pk) | Q(customer_dependency__customer=pk), Q(currency=currency), Q(bill__isnull=True))
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