"""stock views"""

# django
from django.http import Http404
from django.db.models.deletion import ProtectedError

# third
from rest_framework import status, viewsets, filters
from rest_framework.response import Response
from rest_framework.views import APIView

# local
from .models import Item, Kit
from .serializers import ItemSerializer, ItemSerializerForReadOnly, KitSerializer
from . import paginators


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    pagination_class = paginators.ItemPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'code', 'description']

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return ItemSerializerForReadOnly
        return ItemSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            item_pk = kwargs['pk']
            item = Item.objects.get(pk=item_pk)
            return Response(
                data={
                    'item': ItemSerializer(item).data
                },
                status=status.HTTP_400_BAD_REQUEST
            )


class ItemListPagination(APIView, paginators.ItemPagination):
    def get(self, request, format=None):
        items = Item.objects.all()
        
        # Búsqueda
        search_term = request.query_params.get('search', None)
        if search_term:
            items = items.filter(name__icontains=search_term)
        
        results = self.paginate_queryset(items, request, view=self)
        serializer = ItemSerializerForReadOnly(results, many=True)
        return self.get_paginated_response(serializer.data)


class ItemDetail(APIView):
    def get_object(self, pk):
        try:
            return Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            raise Http404
        
    def get(self, request, pk, format=None):
        item = self.get_object(pk=pk)
        serializer = ItemSerializerForReadOnly(item)
        return Response(serializer.data)


class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    serializer_class = KitSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            kit_pk = kwargs['pk']
            kit = Kit.objects.get(pk=kit_pk)
            return Response(data={
                    "kit": KitSerializer(kit).data
                }, status=status.HTTP_400_BAD_REQUEST
            )


class KitListPagination(APIView, paginators.KitPagination):
    def get(self, request, format=None):
        kits = Kit.objects.all()
        results = self.paginate_queryset(kits, request, view=self)
        serializer = KitSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)