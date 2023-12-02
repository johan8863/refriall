"""hr models"""

# django
from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Meta:
        abstract = True


class Provider(CustomUser):
    license_number = models.CharField('Licencia', max_length=15)
    personal_id = models.CharField('CI', max_length=11)

    REQUIRED_FIELDS = [
        'first_name',
        'last_name',
        'license_number',
        'personal_id',
    ]

    class Meta:
        ordering = ['last_name']
        verbose_name = 'Prestador'
        verbose_name_plural = 'Prestadores'
    
    def __str__(self):
        """String object representation"""
        return self.get_full_name()


class Customer(models.Model):
    """Customer Model, it is used to identify who target the orders and the bills"""
    CLIENT_TYPE = [
        ('es', 'ESTATAL'),
        ('pr', 'PARTICULAR'),
    ]

    customer_type = models.CharField('Tipo', max_length=2, choices=CLIENT_TYPE)
    name = models.CharField('Nombre', max_length=150)
    address = models.TextField('Dirección')
    province = models.CharField('Provincia', max_length=20)
    township = models.CharField('Municipio', max_length=50)
    code = models.CharField('Código', max_length=20)
    client_nit = models.CharField('NIT', max_length=100, null=True, blank=True)
    bank_account_header = models.CharField('Titular de la Cuenta', max_length=150)
    bank_account = models.CharField('Nro. de Cuenta', max_length=50)

    class Meta:
        ordering = ['name']
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
    
    def __str__(self):
        """Returns  the string object representation"""
        return self.name