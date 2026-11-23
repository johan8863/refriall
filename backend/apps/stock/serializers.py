"""stock serializers"""

# third
from rest_framework import serializers

# local
from .models import Item, ItemOrder, Kit

# Items that only accept 'u' (Uno) as measurement.
# Products ('prod') are the only ones allowed to use other units.
_SINGLE_UNIT_ITEM_TYPES = frozenset({
    'concept',
    'repair',
    'maintenace',
    'install',
    'unmounting',
})


def validate_item_business_rules(attrs, *, skip_missing=()):
    """
    Shared business rules for Item and ItemOrder.

    :param attrs: validated data dict from the serializer.
    :param skip_missing: field names to skip if absent (e.g. ItemOrderDetail
        may not include `measurement` in its fields).
    :raises serializers.ValidationError: on rule violation.
    """
    item_type = attrs.get('item_type')
    measurement = attrs.get('measurement')
    price = attrs.get('price')

    if (
        'measurement' not in skip_missing
        and item_type in _SINGLE_UNIT_ITEM_TYPES
        and measurement != 'u'
    ):
        raise serializers.ValidationError({
            'item_type': (
                'Solamente los productos puede tener unidad de medida distinto de Uno.'
            )
        })

    if 'price' not in skip_missing and price is not None and price < 0.01:
        raise serializers.ValidationError({
            'price': 'El valor mínimo es 0.01.'
        })

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
            "get_item_type",
            "get_measurement",
        ]

        read_only_fields = [
            "get_item_type",
            "get_measurement",
        ]
    
    def validate(self, attrs):
        validate_item_business_rules(attrs)
        return super().validate(attrs)


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

        read_only_fields = [
            "get_item_type",
            "get_measurement",
        ]


class KitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kit
        fields = ["id", "name"]