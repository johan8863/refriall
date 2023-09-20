"""finance serializers"""

# third
from rest_framework import serializers

# local
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
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
            "items",
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