"""stock views"""

# third
from rest_framework import viewsets

# local
from .models import Item, Kit
from .serializers import ItemSerializer, KitSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    serializer_class = KitSerializer