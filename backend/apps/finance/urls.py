"""finance urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'bills', views.BillViewSet, basename='bills')
router.register(r'currencies_write', views.CurrencyViewSet, basename='currencies')

urlpatterns = [
    path('', include(router.urls)),
]