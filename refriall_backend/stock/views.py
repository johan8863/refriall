"""stock views"""

# third
from rest_framework.views import APIView
from rest_framework import viewsets

# local
from .models import Item, Kit
from .serializers import ItemSerializer, KitSerializer
from . import paginators


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class ItemListPagination(APIView, paginators.ItemPagination):
    def get(self, request, format=None):
        items = Item.objects.all()
        results = self.paginate_queryset(items, request, view=self)
        serializer = ItemSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)


class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    serializer_class = KitSerializer


class KitListPagination(APIView, paginators.KitPagination):
    def get(self, request, format=None):
        kits = Kit.objects.all()
        results = self.paginate_queryset(kits, request, view=self)
        serializer = KitSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)