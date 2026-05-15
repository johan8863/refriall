"""hr paginator module"""

# third
from rest_framework.pagination import PageNumberPagination


class CustomerPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProviderPagination(PageNumberPagination):
    page_size = 10