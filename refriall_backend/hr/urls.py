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

urlpatterns = [
    path('', include(router.urls)),
]