"""stock paginator module"""

# third
from rest_framework.pagination import PageNumberPagination


class ItemPagination(PageNumberPagination):
    page_size = 10


class KitPagination(PageNumberPagination):
    page_size = 10