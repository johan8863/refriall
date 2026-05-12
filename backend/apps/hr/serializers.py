"""hr serializers"""

# third
from rest_framework import serializers

# local
from .models import Provider, Customer, CustomerDependency

# serializers.py
class ProviderUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating provider profile information.
    Password fields are NOT included - use separate endpoint for password changes.
    """
    
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
        read_only_fields = ["id"]

    def validate_username(self, value):
        """Username must be unique (excluding current user)."""
        instance = self.instance
        if Provider.objects.filter(username=value).exclude(pk=instance.pk).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value

    def validate_bank_account(self, value):
        """Bank account must be exactly 16 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("La cuenta bancaria debe contener sólo números.")
        if len(value) != 16:
            raise serializers.ValidationError("La cuenta bancaria debe contener 16 caracteres.")
        return value

    def validate_personal_id(self, value):
        """Personal ID must be exactly 11 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("El CI debe contener sólo números.")
        if len(value) != 11:
            raise serializers.ValidationError("El CI debe contener 11 caracteres.")
        return value

    def update(self, instance, validated_data):
        """Update only the provided fields."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# serializers.py

class ProviderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new providers with password confirmation.
    """
    confirm_password = serializers.CharField(write_only=True, required=True)

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
            "confirm_password",
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
        }

    def validate(self, data):
        """Check that passwords match."""
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Las contraseñas no coinciden.'
            })
        return data

    def validate_username(self, value):
        """Username must be unique."""
        if Provider.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nombre de usuario ya existe.")
        return value

    def validate_bank_account(self, value):
        """Bank account must be exactly 16 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("La cuenta bancaria debe contener sólo números.")
        if len(value) != 16:
            raise serializers.ValidationError("La cuenta bancaria debe contener 16 caracteres.")
        return value

    def validate_personal_id(self, value):
        """Personal ID must be exactly 11 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("El CI debe contener sólo números.")
        if len(value) != 11:
            raise serializers.ValidationError("El CI debe contener 11 caracteres.")
        return value

    def create(self, validated_data):
        """Create provider with hashed password."""
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        
        provider = Provider(**validated_data)
        provider.set_password(password)
        provider.save()
        
        return provider

class ProviderPasswordUpdateSerializer(serializers.Serializer):
    """
    Serializer for updating password only.
    Uses Serializer (not ModelSerializer) because it doesn't map directly to model fields.
    """
    current_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate_current_password(self, value):
        """Verify current password is correct."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("La contraseña actual es incorrecta.")
        return value

    def validate(self, data):
        """Check that new passwords match."""
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({
                'confirm_new_password': 'Las nuevas contraseñas no coinciden.'
            })
        
        if data['current_password'] == data['new_password']:
            raise serializers.ValidationError({
                'new_password': 'La nueva contraseña debe ser diferente a la actual.'
            })
        
        return data

    def save(self, **kwargs):
        """Update the user's password."""
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user



class ProviderAdminPasswordResetSerializer(serializers.Serializer):
    """
    Serializer for admin to reset ANY user's password.
    No current password required - only for privileged users.
    """
    new_password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_new_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        """Check that new passwords match."""
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({'confirm_new_password': 'Las contraseñas no coinciden.'})
        return data
    
    def save(self, **kwargs):
        """Reset the user's password."""
        user = self.context['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


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