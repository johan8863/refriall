# Generated by Django 4.2 on 2024-04-25 19:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0017_alter_order_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bill',
            name='customer_signature_date',
            field=models.DateField(null=True, verbose_name='Firma del cliente'),
        ),
    ]
