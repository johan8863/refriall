# Generated by Django 4.2 on 2024-04-26 01:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0009_itemorder'),
        ('finance', '0022_itemtimeorder'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='items_order',
            field=models.ManyToManyField(blank=True, editable=False, through='finance.ItemTimeOrder', to='stock.itemorder', verbose_name='Artículo o Servicio'),
        ),
    ]