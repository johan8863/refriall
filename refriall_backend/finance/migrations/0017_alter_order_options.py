# Generated by Django 4.2 on 2024-04-25 19:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0016_order_provider_signature_date'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='order',
            options={'ordering': ['provider_signature_date'], 'verbose_name': 'Orden de Servicio', 'verbose_name_plural': 'Órdenes de Servicio'},
        ),
    ]
