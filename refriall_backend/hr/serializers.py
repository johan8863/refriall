"""hr serializers"""

# third
from rest_framework import serializers

# local
from .models import Provider, Customer


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "license_number",
            "personal_id",
        ]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id",
            "customer_type",
            "name",
            "address",
            "province",
            "township",
            "code",
            "client_nit",
            "bank_account_header",
            "bank_account",
        ]