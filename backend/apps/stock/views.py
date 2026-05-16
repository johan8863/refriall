"""stock views"""

# django
from django.http import Http404
from django.db.models.deletion import ProtectedError

# third
from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

# local
from .models import Item, Kit
from .serializers import ItemSerializer, ItemSerializerForReadOnly, KitSerializer
from . import paginators


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    filter_backends = [filters.SearchFilter]

    def get_serializer_class(self):
        if self.action in ['retrieve', 'list']:
            return ItemSerializerForReadOnly
        return self.serializer_class

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
    
    @action(detail=False, methods=['get'], url_path='item-list-pagination')
    def get_item_list_pagination(self, request):
        """Return Items paginated"""

        # queryset
        items = Item.objects.all()

        # search
        search_term = request.query_params.get('search', None)
        if search_term:
            items = items.filter(name__icontains=search_term)

        # pagination
        paginator = paginators.ItemPagination()
        page = paginator.paginate_queryset(items, self.request)

        # response
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # fallback
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


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

        # Search y 'search' parameter is included
        search_term  = request.query_params.get('search', None)
        if search_term:
            kits = kits.filter(name__icontains=search_term)

        results = self.paginate_queryset(kits, request, view=self)
        serializer = KitSerializer(results, many=True)
        return self.get_paginated_response(serializer.data)