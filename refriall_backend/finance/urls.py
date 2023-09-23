"""finance urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'orders', views.OrderViewSet, basename='orders')
router.register(r'itemtimes', views.ItemTimeViewSet, basename='itemtimes')

urlpatterns = [
    path('', include(router.urls)),
]