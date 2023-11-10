"""finance serializers"""

# third
from rest_framework import serializers

# local
from .models import Order, ItemTime
from hr.serializers import CustomerSerializer
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
    customer = CustomerSerializer()

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
            "get_total_amount",
            "get_total_amount_product",
            "get_total_amount_concept",
            "get_total_amount_repair",
            "get_total_amount_maintenace",
            "get_total_amount_install",
            "get_total_amount_unmounting",
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
        for attr in [
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
            "aproved_by"
        ]:
            setattr(instance, attr, validated_data.get(attr, instance))

        # itemtime updating
        new_itemtimes = validated_data.get('itemtime_set')
        instance.items.clear()

        for itemtime in new_itemtimes:
            ItemTime.objects.create(order=instance, **itemtime)

        instance.save()
        return instance