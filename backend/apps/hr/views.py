"""hr views"""

# django
from django.http import Http404
from django.db.models import Q
from django.db.models.deletion import ProtectedError

# third
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

# local
from .models import Customer, Provider, CustomerDependency
from .serializers import (
    CustomerSerializer,
    CustomerDetailSerializer,
    ProviderCreateSerializer,
    ProviderUpdateSerializer,
    ProviderPasswordUpdateSerializer,
    ProviderAdminPasswordResetSerializer,
    CustomerDependencySerializer
)
from .paginators import CustomerPagination, ProviderPagination
from ..finance.models import Order


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CustomerDetailSerializer
        return self.serializer_class

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            customer_pk = kwargs['pk']
            customer = Customer.objects.get(pk=customer_pk)
            return Response(
                data={
                    'customer': CustomerSerializer(customer).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, url_path='customers-list-pagination')
    def get_customer_list_pagination(self, request):
        """List customers paginated"""
        customers = self.get_queryset()

        # search term
        search_term = request.query_params.get('search', None)
        if search_term:
            customers = customers.filter(name__icontains=search_term)

        paginator = CustomerPagination()
        page = paginator.paginate_queryset(customers, request)

        # Apply pagination
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Fallback
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)


class CustomerOrderCurrencyProviderNoBill(APIView):
    """Return all customers with orders without bills with the received currency"""
    def get(self, request, currency_pk, provider_pk, format=None):
        orders_without_bill = Order.objects.filter(bill__isnull=True, currency=currency_pk, provider=provider_pk)
        unique_customers = orders_without_bill.values('customer').distinct()
        unique_customer_dependencies = orders_without_bill.values('customer_dependency').distinct()
        customers = Customer.objects.filter(Q(id__in=unique_customers) | Q(dependencies__in=unique_customer_dependencies)).distinct()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)


class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderUpdateSerializer
    # pagination_class = ProviderPagination

    def get_serializer_class(self):
        """
        Returns different serializers based on the actions
        """
        if self.action == 'create':
            return ProviderCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ProviderUpdateSerializer
        return ProviderUpdateSerializer
    
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            provider_pk = kwargs['pk']
            provider = Provider.objects.get(pk=provider_pk)
            return Response(
                data=ProviderUpdateSerializer(provider),
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """
        Custom endpoint for users to change their own password.
        POST /api/providers/change-password/
        """
        serializer = ProviderPasswordUpdateSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Contraseña actualizada correctamente."}, 
            status=status.HTTP_200_OK
        )
    
    @action(
        detail=True, 
        methods=['post'],
        url_path="admin-reset-password",
        permission_classes=[IsAdminUser]
    )
    def admin_reset_password(self, request, pk=None):
        """
        Admin endpoint to reset ANY user's password.
        POST /api/providers/{id}/admin-reset-password/
        """
        
        user = self.get_object()

        serializer = ProviderAdminPasswordResetSerializer(
            data=request.data,
            context={'user': user}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "detail": f"Clave cambiada con éxito en el usuario {user.username}"
            },
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, url_path="get-provider-order-currency-no-bill/(?P<currency>[0-9]+)")
    def get_provider_order_currency_no_bill(self, request, currency):
        """Returns provider with free orders to associate given a currency."""
        orders_without_bill = Order.objects.filter(bill__isnull=True, currency=currency)
        unique_providers = orders_without_bill.values('provider').distinct()
        providers = Provider.objects.filter(id__in=unique_providers)
        serializer = ProviderUpdateSerializer(providers, many=True)
        return Response(serializer.data)
    
    @action(detail=False, url_path="get-providers-paginated")
    def get_providers_paginated(self, request, format=None):
        """Returns the list of providers pagianted."""
        providers = self.get_queryset()
        # Create paginator ONLY for this action
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginator.page_size_query_param = 'page_size'
        paginator.max_page_size = 100

        # Apply pagination
        page = paginator.paginate_queryset(providers, request)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # Fallback
        serializer = self.get_serializer(providers, many=True)
        return Response(serializer.data)


class CustomerDependencyViewSet(viewsets.ModelViewSet):
    queryset = CustomerDependency.objects.all()
    serializer_class = CustomerDependencySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'customer__name']

    def get_queryset(self):
        queryset = CustomerDependency.objects.all()
        customer_id = self.request.query_params.get('customer', None)
        if customer_id:
            queryset = queryset.filter(customer_id=customer_id)
        return queryset
    
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            dependency_pk = kwargs['pk']
            dependency = CustomerDependency.objects.get(pk=dependency_pk)
            return Response(
                data={
                    'dependency': CustomerDependencySerializer(dependency).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )