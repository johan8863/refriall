"""stock serializers"""

# third
from rest_framework import serializers

# local
from .models import Item, ItemOrder, Kit


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
    
    def validate(self, attrs):
        if ((attrs['item_type'] == 'concept' or
            attrs['item_type'] == 'repair' or
            attrs['item_type'] == 'maintenace' or
            attrs['item_type'] == 'install' or
            attrs['item_type'] == 'unmounting')
            and attrs['measurement'] != 'u'):
            raise serializers.ValidationError({
                'item_type': 'Solamente los productos puede tener unidad de medida distinto de Uno.'
            })
        if attrs['price'] < 0.01:
            raise serializers.ValidationError({
                'price': 'El valor mínimo es 0.01.'
            })
        return super().validate(attrs)


class ItemSerializerForReadOnly(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            "id",
            "code",
            "name",
            "get_item_type",
            "get_measurement",
            "price",
        ]


class ItemOrderSerializerDetail(serializers.ModelSerializer):
    class Meta:
        model = ItemOrder
        fields = [
            "id",
            "code",
            "name",
            "get_item_type",
            "get_measurement",
            "price",
        ]


class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = ["id", "name"]