"""hr urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'customers', views.CustomerViewSet, basename='customers')
router.register(r'providers', views.ProviderViewSet, basename='providers')
router.register(r'dependencies', views.CustomerDependencyViewSet, basename='dependencies')

urlpatterns = [
    path('', include(router.urls)),
    path('customers/list/pagination/', views.CustomerListPagination.as_view(), name='customers_list_pagination'),
    path('customers/detail/<int:pk>/', views.CustomerDetail.as_view(), name='customers_detail'),
    path('customers/orders/nobill/<int:currency>/', views.CustomerOrderCurrencyNoBill.as_view(), name='customers_order_no_bill'),
    path('providers/list/pagination/', views.ProviderListPagination.as_view(), name='providers_list_pagination'),
]