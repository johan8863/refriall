"""finance admin"""

# django
from django.contrib import admin

# local
from .models import Order, ItemTime

admin.site.register(Order)
admin.site.register(ItemTime)