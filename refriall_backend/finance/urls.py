"""finance urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'orders_write', views.OrderViewSet, basename='orders')
router.register(r'bills_write', views.BillViewSet, basename='bills')
router.register(r'currencies_write', views.CurrencyViewSet, basename='currencies')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/list/', views.OrderList.as_view(), name='orders_list'),
    path('orders/list/pagination/', views.OrderListPagination.as_view(), name='orders_list'),
    path('orders/detail/<int:pk>/', views.OrderDetail.as_view(), name='orders_detail'),
    path('orders/fromcustomernotmatched/<int:pk>/<int:currency>/', views.OrderFromCustomerNotMatched.as_view(), name='orders_fromcustomer_notmatched'),
    path('orders/fromcustomer/<int:pk>/', views.OrderFromCustomer.as_view(), name='orders_fromcustomer'),
    path('orders/notmatched/', views.OrderNotMatched.as_view(), name='orders_notmatched'),
    path('bills/list/pagination/', views.BillListPagination.as_view(), name='bills_list'),
    path('bills/detail/<int:pk>/', views.BillDetail.as_view(), name='bills_detail'),
    path('bills/detail/update/<int:pk>/', views.BillDetailUpdate.as_view(), name='bills_detail_update'),
]