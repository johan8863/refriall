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
    
    def validate_all_digits(self, attr):
        """validates all characters in attr are digits"""

        str_attr = str(attr)
        return str_attr.isdigit()
    
    def validate_license_number(self, value):
        """license_number attr must be exactly 16 characters long"""

        license_number_len = len(value)

        if not self.validate_all_digits(value):
            raise serializers.ValidationError("La licencia debe contener sólo números.")

        if license_number_len != 16:
            raise serializers.ValidationError("La licencia debe contener 16 caracteres.")
        return value
    
    def validate_personal_id(self, value):
        """personal_id attr must be exactly 11 characters long"""

        personal_id_len = len(value)

        if not self.validate_all_digits(value):
            raise serializers.ValidationError("El CI debe contener sólo números.")
            
        if personal_id_len != 11:
            raise serializers.ValidationError("El CI debe contener 11 caracteres.")
        return value


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