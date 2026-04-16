"""stock admin"""

# django
from django.contrib import admin

# local
from .models import Item

admin.site.register(Item)