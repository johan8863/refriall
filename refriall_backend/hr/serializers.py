"""hr serializers"""

# third
from rest_framework import serializers

# local
from .models import Provider, Customer, CustomerDependency


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "tcp_code",
            "bank_account_header",
            "bank_account",
            "address",
            "activity",
            "license_number",
            "personal_id",
        ]


class CustomerDependencySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDependency
        fields = [
            "id",
            "customer",
            "name",
            "address",
            "province",
            "township"
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


class CustomerSerializerDetail(serializers.ModelSerializer):
    get_dependencies = CustomerDependencySerializer(many=True)

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
            "get_dependencies",
        ]