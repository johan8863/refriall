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
    path('items/list/pagination/', views.ItemListPagination.as_view(), name='items_list_pagination'),
    path('items/list/select/', views.ItemListForSelect.as_view(), name='items_list_select'),
    path('items/detail/<int:pk>/', views.ItemDetail.as_view(), name='items_detail'),
    path('kits/list/pagination/', views.KitListPagination.as_view(), name='kits_list_pagination'),
]