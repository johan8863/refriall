"""stock models"""

# django
from django.db import models


class Item(models.Model):
    """
    The source model of the software. It represents the 'items'
    registered in service orders and bills. They can be six types as shown 
    in the item_type attribute.
    """
    ITEM_TYPES = [
        ('product', 'Producto'),
        ('concept', 'Concepto'),
        ('repair', 'Reparación'),
        ('maintenace', 'Mtto'),
        ('install', 'Instal/Mont'),
        ('unmounting', 'Desmontaje'),
    ]

    MEASUREMENTS = [
        ('u', 'Uno'),
        ('m', 'Metros'),
        ('kg', 'Kilogramos'),
        ('lts', 'Litros'),
    ]

    code = models.CharField('Código', max_length=15, unique=True)
    name = models.CharField('Nombre', max_length=120)
    item_type = models.CharField('Tipo', max_length=11, choices=ITEM_TYPES)
    measurement = models.CharField(
        'Unidad de medida',
        max_length=3,
        choices=MEASUREMENTS,
        null=True,
        blank=True
    )
    price = models.FloatField('Precio')


    class Meta:
        ordering = ['name']
        verbose_name = 'Artículo'
        verbose_name_plural = 'Artículos'
    
    def __str__(self):
        """Returns the string object representation"""
        return self.name
    

class Kit(models.Model):
    """Kit model, it'll be used to select the kind of kit in the order"""
    name = models.CharField('Nombre', max_length=50, unique=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Equipo"
        verbose_name_plural = "Equipos"
    
    def __str__(self):
        """Returns the string object representation"""
        return self.name