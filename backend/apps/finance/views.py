"""finance views"""

# django
from django.db.models import Q
from django.db.models.deletion import ProtectedError
from django.http import Http404

# third
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets

# local
from .models import Bill, Currency, Order
from .serializers import (
    BillSerializer,
    BillSerializerDeleteError,
    BillSerializerForReadOnly,
    BillSerializerReadListView,
    CurrencySerializer,
    OrderSerializerForReadOnly,
    OrderSerializer,
    OrderSerializerReadListView
)
from ...utils.base_paginator import BaseCustomPagination


class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer

    def destroy(self, request, *args, **kwargs):
        """Custome function to watch the ProtectedError case"""
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


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.all()

    def get_serializer_class(self):
        if self.action == 'get_bill_list_pagination':
            return BillSerializerReadListView
        elif self.action == 'retrieve':
            return BillSerializerForReadOnly
        return BillSerializer
    
    @action(detail=False, url_path='bill-list-pagination')
    def get_bill_list_pagination(self, request, format=None):
        """Returns bills list pagianted"""

        # queryset
        bills = Bill.objects.all()
        
        # search
        search_term = request.query_params.get('search', None)
        if search_term:
            bills = bills.filter(
                Q(folio__icontains=search_term) |
                Q(customer__name__icontains=search_term)
            )
        
        # pagination
        paginator = BaseCustomPagination()
        results = paginator.paginate_queryset(bills, request)

        serializer = self.get_serializer(results, many=True)
        return paginator.get_paginated_response(serializer.data)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'get_orders_list_pagination']:
            return OrderSerializerReadListView
        elif self.action in ['get_order_detail', 'get_orders_from_currency_customer_free_bill']:
            return OrderSerializerForReadOnly
        return self.serializer_class

    def destroy(self, request, *args, **kwargs):
        order = Order.objects.get(pk=kwargs['pk'])
        if order.bill_id is None:
            return super().destroy(request, *args, **kwargs)
        else:
            bill = Bill.objects.get(pk=order.bill_id)
            serializer = BillSerializerDeleteError(bill)
            return Response(data=serializer.data, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, url_path='orders-list-pagination')
    def get_orders_list_pagination(self, request):
        orders = Order.objects.all()
        
        # Search by folio, customer name or dependency
        search_term = request.query_params.get('search', None)
        if search_term:
            orders = orders.filter(
                Q(folio__icontains=search_term) |
                Q(customer__name__icontains=search_term) |
                Q(customer_dependency__name__icontains=search_term)
            )
        
        # pagination
        paginator = BaseCustomPagination()
        page = paginator.paginate_queryset(orders, request)

        # fallback
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, url_path='order-detail')
    def get_order_detail(self, request, pk):
        """Return an Order serializer with inner serializers and property methods"""
        order = self.get_object()
        serializer = self.get_serializer(order)
        return Response(serializer.data)
    
    @action(detail=False, url_path='orders-from-currency-customer-free-bill/(?P<currency_pk>[0-9]+)/(?P<provider_pk>[0-9]+)/(?P<customer_pk>[0-9]+)')
    def get_orders_from_currency_customer_free_bill(self, request, currency_pk, provider_pk, customer_pk):
        orders = Order.objects.filter(Q(customer=customer_pk) | Q(customer_dependency__customer=customer_pk), Q(currency=currency_pk), Q(provider=provider_pk), Q(bill__isnull=True))
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
