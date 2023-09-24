"""finance serializers"""

# third
from rest_framework import serializers

# local
from .models import Order, ItemTime
from stock.serializers import ItemSerializer


class ItemTimeSerializerForReadOnly(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = ItemTime
        fields = [
            "id",
            "item",
            "times",
        ]


class OrderSerializerForReadOnly(serializers.ModelSerializer):
    itemtime_set = ItemTimeSerializerForReadOnly(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "symptom",
            "flaw",
            "repair_description",
            "folio",
            "check_diagnosis",
            "repair",
            "install",
            "maintenance",
            "kit",
            "kit_brand",
            "kit_model",
            "kit_serial",
            "job_description",
            "itemtime_set",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "check_number",
            "charge_aprove",
            "charge_check",
            "customer_charge",
            "customer_name",
            "customer_personal_id",
            "checked_by",
            "aproved_by",
        ]


class ItemTimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemTime
        fields = [
            "id",
            "item",
            "order",
            "times",
        ]


class OrderSerializer(serializers.ModelSerializer):
    itemtime_set = ItemTimeSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "symptom",
            "flaw",
            "repair_description",
            "folio",
            "check_diagnosis",
            "repair",
            "install",
            "maintenance",
            "kit",
            "kit_brand",
            "kit_model",
            "kit_serial",
            "job_description",
            "itemtime_set",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "check_number",
            "charge_aprove",
            "charge_check",
            "customer_charge",
            "customer_name",
            "customer_personal_id",
            "checked_by",
            "aproved_by",
        ]

    def create(self, validated_data):
        itemtime_set = validated_data.pop('itemtime_set')
        order = Order.objects.create(**validated_data)
        for itemtime in itemtime_set:
            ItemTime.objects.create(order=order, **itemtime)
        return order
    
    def update(self, instance, validated_data):
        instance.customer = validated_data.get('customer', instance)
        instance.symptom = validated_data.get('symptom', instance)
        instance.flaw = validated_data.get('flaw', instance)
        instance.repair_description = validated_data.get('repair_description', instance)
        instance.folio = validated_data.get('folio', instance)
        instance.check_diagnosis = validated_data.get('check_diagnosis', instance)
        instance.repair = validated_data.get('repair', instance)
        instance.install = validated_data.get('install', instance)
        instance.maintenance = validated_data.get('maintenance', instance)
        instance.kit = validated_data.get('kit', instance)
        instance.kit_brand = validated_data.get('kit_brand', instance)
        instance.kit_model = validated_data.get('kit_model', instance)
        instance.kit_serial = validated_data.get('kit_serial', instance)
        instance.job_description = validated_data.get('job_description', instance)
        instance.provider = validated_data.get('provider', instance)
        instance.provider_signature_date = validated_data.get('provider_signature_date', instance)
        instance.customer_signature_date = validated_data.get('customer_signature_date', instance)
        instance.check_number = validated_data.get('check_number', instance)
        instance.charge_aprove = validated_data.get('charge_aprove', instance)
        instance.charge_check = validated_data.get('charge_check', instance)
        instance.customer_charge = validated_data.get('customer_charge', instance)
        instance.customer_name = validated_data.get('customer_name', instance)
        instance.customer_personal_id = validated_data.get('customer_personal_id', instance)
        instance.checked_by = validated_data.get('checked_by', instance)
        instance.aproved_by = validated_data.get('aproved_by', instance)

        # itemtime updating
        new_itemtimes = validated_data.get('itemtime_set')
        instance.items.clear()

        for itemtime in new_itemtimes:
            ItemTime.objects.create(order=instance, **itemtime)

        instance.save()
        return instance