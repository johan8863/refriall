# Generated by Django 4.2 on 2024-04-25 19:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0013_remove_bill_customer_dependency'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={'verbose_name': 'Orden de Servicio', 'verbose_name_plural': 'Órdenes de Servicio'},
        ),
    ]
