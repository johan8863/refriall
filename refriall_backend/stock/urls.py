"""stock urls"""

# django
from django.urls import include, path

# third
from rest_framework import routers

# local
from . import views

router = routers.DefaultRouter()
router.register(r'items', views.ItemViewSet, basename='items')
router.register(r'kits', views.KitViewSet, basename='kits')

urlpatterns = [
    path('', include(router.urls)),
]