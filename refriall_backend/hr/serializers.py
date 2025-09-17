"""hr serializers"""

# third
from rest_framework import serializers

# local
from .models import Provider, Customer, CustomerDependency


class ProviderSerializerRead(serializers.ModelSerializer):
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
            "password",
            "personal_id",
        ]


class ProviderSerializerWrite(serializers.ModelSerializer):
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
            "password",
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
            "township",
            "get_bank_account_header",
            "get_bank_account",
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