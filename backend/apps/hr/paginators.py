"""hr paginator module"""

# third
from rest_framework.pagination import PageNumberPagination


class CustomerPagination(PageNumberPagination):
    page_size = 10


class ProviderPagination(PageNumberPagination):
    page_size = 10