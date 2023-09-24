"""finance urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'orders', views.OrderViewSetReadOnly, basename='orders')
router.register(r'orders_write', views.OrderViewSet, basename='orders_write')

urlpatterns = [
    path('', include(router.urls)),
]