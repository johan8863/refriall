"""stock views"""

# django
from django.db.models.deletion import ProtectedError

# third
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

# local
from .models import Item, Kit
from .serializers import ItemSerializer, KitSerializer
from ...utils.base_paginator import BaseCustomPagination


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            item = self.get_object()
            serializer = ItemSerializer(item)
            return Response(
                data=serializer.data,
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
        paginator = BaseCustomPagination()
        page = paginator.paginate_queryset(items, self.request)

        # response
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # fallback
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)


class KitViewSet(viewsets.ModelViewSet):
    queryset = Kit.objects.all()
    serializer_class = KitSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            kit = self.get_object()
            serializer = KitSerializer(kit)
            return Response(
                data=serializer.data,
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, url_path='kits-list-paginated')
    def get_kits_list_paginated(self, request, format=None):
        kits = Kit.objects.all()

        # search
        search_term = request.query_params.get('search', None)
        if search_term:
            kits = kits.filter(name__icontains=search_term)

        # pagination
        paginator = BaseCustomPagination()
        page = paginator.paginate_queryset(kits, self.request)

        # response
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        # fallback
        serializer = self.get_serializer(kits, many=True)
        return Response(serializer.data)
