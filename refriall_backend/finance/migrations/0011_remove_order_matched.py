# Generated by Django 4.2 on 2024-02-18 17:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0010_alter_order_bill'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='matched',
        ),
    ]