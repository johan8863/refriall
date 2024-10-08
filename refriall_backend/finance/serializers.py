"""finance serializers"""

# third
from rest_framework import serializers

# local
from .models import Bill, Currency, Order, ItemTime, ItemTimeOrder
from hr.serializers import CustomerSerializer, CustomerDependencySerializer, ProviderSerializer
from stock.serializers import ItemSerializer, ItemOrderSerializerDetail, ItemSerializerForReadOnly, KitSerializer
from stock.models import ItemOrder


class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ["id", "name", "description"]


class ItemTimeSerializerForReadOnly(serializers.ModelSerializer):
    item = ItemSerializerForReadOnly()

    class Meta:
        model = ItemTime
        fields = [
            "id",
            "item",
            "times",
        ]


class ItemTimeOrderSerializerDetail(serializers.ModelSerializer):
    item = ItemOrderSerializerDetail()

    class Meta:
        model = ItemTime
        fields = [
            "id",
            "item",
            "times",
        ]


class OrderSerializerForReadOnly(serializers.ModelSerializer):
    itemtime_set = ItemTimeSerializerForReadOnly(many=True)
    itemtimeorder_set = ItemTimeSerializerForReadOnly(many=True)
    customer = CustomerSerializer()
    customer_dependency = CustomerDependencySerializer()
    kit = KitSerializer()
    provider = ProviderSerializer()
    currency = CurrencySerializer()

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "customer_dependency",
            "symptom",
            "flaw",
            "repair_description",
            "folio",
            "check_diagnosis",
            "repair",
            "install",
            "maintenance",
            "get_order_support",
            "kit",
            "kit_brand",
            "kit_model",
            "kit_serial",
            "job_description",
            "itemtime_set",
            "itemtimeorder_set",
            "provider",
            "provider_signature_date",
            "currency",
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
            "get_total_amount_revision",
            "get_total_amount_prod",
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


class ItemOrderTimeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ItemTimeOrder
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
            "customer_dependency",
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
            "currency",
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
        if attrs['customer'] and attrs['customer_dependency']:
            raise serializers.ValidationError({
                'non_field_errors': 'Debe seleccionar un cliente o una dependencia pero no ambos.'
            })
        if attrs['customer'] == None and attrs['customer_dependency'] == None:
            raise serializers.ValidationError({
                'non_field_errors': 'Debe seleccionar un cliente o una dependencia.'
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
            item_object = itemtime['item']
            item_order = ItemOrder.objects.create(
                code = item_object.code,
                name = item_object.name,
                item_type = item_object.item_type,
                measurement = item_object.measurement,
                price = item_object.price,
            )
            times = itemtime['times']
            ItemTimeOrder.objects.create(order=order, item=item_order, times=times)
            # create the relationship ItemTime - Order per itemtime "item" in the list
            ItemTime.objects.create(order=order, **itemtime)
        return order
    
    def update(self, instance, validated_data):
        for attr in [
            "customer", 
            "customer_dependency", 
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
            "currency",
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
        instance.items_order.clear()

        for itemtime in new_itemtimes:
            item_object = itemtime['item']
            item_order = ItemOrder.objects.create(
                code = item_object.code,
                name = item_object.name,
                item_type = item_object.item_type,
                measurement = item_object.measurement,
                price = item_object.price,
            )
            times = itemtime['times']
            ItemTime.objects.create(order=instance, **itemtime)
            ItemTimeOrder.objects.create(order=instance, item=item_order, times=times)

        instance.save()
        return instance


class BillSerializerForReadOnly(serializers.ModelSerializer):
    customer = CustomerSerializer()
    provider = ProviderSerializer()
    get_orders = OrderSerializerForReadOnly(many=True)
    currency = CurrencySerializer()

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "currency",
            "folio",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "get_orders",
            "get_orders_folio",
            "get_total_amount",
            "get_total_amount_revision",
            "get_total_amount_prod",
            "get_total_amount_concept",
            "get_total_amount_repair",
            "get_total_amount_maintenace",
            "get_total_amount_install",
            "get_total_amount_unmounting",
            "check_number",
            "charge_aprove",
            "charge_check",
            "customer_charge",
            "customer_name",
            "customer_personal_id",
            "checked_by",
            "aproved_by"
        ]


class BillSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "currency",
            "folio",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "orders",
            "check_number",
            "charge_aprove",
            "charge_check",
            "customer_charge",
            "customer_name",
            "customer_personal_id",
            "checked_by",
            "aproved_by"
        ]
    
    def validate(self, attrs):
        print(attrs['orders'])
        if attrs['customer'] == None:
            raise serializers.ValidationError({
                'customer': 'Debe seleccionar un cliente.'
            })
        if attrs['orders'] == []:
            raise serializers.ValidationError({
                'orders': 'Debe seleccionar al menos una orden'
            })
        return super().validate(attrs)


class BillSerializerDetailUpdate(serializers.ModelSerializer):
    get_orders = OrderSerializerForReadOnly(many=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "currency",
            "folio",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "orders",
            "get_orders",
            "check_number",
            "charge_aprove",
            "charge_check",
            "customer_charge",
            "customer_name",
            "customer_personal_id",
            "checked_by",
            "aproved_by"
        ]
    
    def validate(self, attrs):
        print(attrs['orders'])
        if attrs['customer'] == None:
            raise serializers.ValidationError({
                'customer': 'Debe seleccionar un cliente.'
            })
        if attrs['orders'] == []:
            raise serializers.ValidationError({
                'orders': 'Debe seleccionar al menos una orden'
            })
        return super().validate(attrs)

    def match_orders(self, orders):
        for order in orders:
            order.matched = True
            order.save()
