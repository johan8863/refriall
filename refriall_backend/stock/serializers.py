"""stock serializers"""

# third
from rest_framework import serializers

# local
from .models import Item, Kit


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "id",
            "code",
            "name",
            "item_type",
            "measurement",
            "price",
        ]


class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = ["id", "name"]