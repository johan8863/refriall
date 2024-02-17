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

urlpatterns = [
    path('', include(router.urls)),
    path('orders/list/', views.OrderList.as_view(), name='orders_list'),
    path('orders/detail/<int:pk>/', views.OrderDetail.as_view(), name='orders_detail'),
    path('orders/fromclientnotmatched/<int:pk>/', views.OrderFromClientNotMatched.as_view(), name='orders_fromclient_notmatched'),
    path('orders/fromclient/<int:pk>/', views.OrderFromClient.as_view(), name='orders_fromclient'),
    path('orders/notmatched', views.OrderNotMatched.as_view(), name='orders_notmatched'),
    path('bills/list/', views.BillList.as_view(), name='bills_list'),
    path('bills/detail/<int:pk>/', views.BillDetail.as_view(), name='bills_detail'),
]