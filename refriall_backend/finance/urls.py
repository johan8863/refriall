"""finance urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'orders_write', views.OrderViewSet, basename='orders')

urlpatterns = [
    path('', include(router.urls)),
    path('orders/list/', views.OrderList.as_view(), name='orders_list'),
]