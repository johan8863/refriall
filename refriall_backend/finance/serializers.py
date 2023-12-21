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
            "support",
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
            "support",
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
    
    def validate(self, attrs):
        if attrs['customer'] == None:
            raise serializers.ValidationError({
                'non_field_errors': 'Debe seleccionar un cliente.'
            })
        if attrs['kit'] == None:
            raise serializers.ValidationError({
                'non_field_errors': 'Debe seleccionar un equipo.'
            })
        if (not attrs['check_diagnosis'] and
           not attrs['repair'] and
           not attrs['install'] and
           not attrs['maintenance']):
            raise serializers.ValidationError({
                'non_field_errors': 'Debe incluir al menos una modalidad.'
            })
        if len(attrs['itemtime_set']) == 0:
            raise serializers.ValidationError({
                'non_field_errors': 'Debe incluir al menos un artículo.'
            })
        return super().validate(attrs)

    # once a nested serializer is configured, create and update methods
    # must be overrriden
    def create(self, validated_data):
        # get the itemtimes
        itemtime_set = validated_data.pop('itemtime_set')
        # create the Order object from the rest of validated_data
        order = Order.objects.create(**validated_data)
        for itemtime in itemtime_set:
            # create the relationship ItemTime - Order per itemtime "item" in the list
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
            "support",
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