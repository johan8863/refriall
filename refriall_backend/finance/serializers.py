"""finance serializers"""

# third
from rest_framework import serializers

# local
from .models import Bill, Order, ItemTime
from hr.serializers import CustomerSerializer, CustomerDependencySerializer, ProviderSerializer
from stock.serializers import ItemSerializer, ItemSerializerForReadOnly, KitSerializer


class ItemTimeSerializerForReadOnly(serializers.ModelSerializer):
    item = ItemSerializerForReadOnly()

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
    customer_dependency = CustomerDependencySerializer()
    kit = KitSerializer()
    provider = ProviderSerializer()

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


class BillSerializerForReadOnly(serializers.ModelSerializer):
    customer = CustomerSerializer()
    customer_dependency = CustomerDependencySerializer()
    provider = ProviderSerializer()
    get_orders = OrderSerializerForReadOnly(many=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "customer_dependency",
            "folio",
            "provider",
            "provider_signature_date",
            "customer_signature_date",
            "get_orders",
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
            "customer_dependency",
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

    # def match_orders(self, orders):
    #     for order in orders:
    #         order.matched = True
    #         order.save()
    
    # def create(self, validated_data):
    #     orders = validated_data.pop('orders')
    #     self.match_orders(orders)
    #     validated_data['orders'] = orders
    #     return super().create(validated_data)
    
    # def update(self, instance, validated_data):
    #     orders = validated_data.pop('orders')
    #     self.match_orders(orders)
    #     validated_data['orders'] = orders
    #     return super().update(instance, validated_data)


class BillSerializerDetailUpdate(serializers.ModelSerializer):
    get_orders = OrderSerializerForReadOnly(many=True)

    class Meta:
        model = Bill
        fields = [
            "id",
            "customer",
            "customer_dependency",
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
    
    # def create(self, validated_data):
    #     orders = validated_data.pop('orders')
    #     self.match_orders(orders)
    #     validated_data['orders'] = orders
    #     return super().create(validated_data)
    
    # def update(self, instance, validated_data):
    #     orders = validated_data.pop('orders')
    #     self.match_orders(orders)
    #     validated_data['orders'] = orders
    #     return super().update(instance, validated_data)