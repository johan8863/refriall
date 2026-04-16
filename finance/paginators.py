"""finance paginator module"""

# third
from rest_framework.pagination import PageNumberPagination


class BillPagination(PageNumberPagination):
    page_size = 10


class OrderPagination(PageNumberPagination):
    page_size = 10