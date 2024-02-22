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
]