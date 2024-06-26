# Generated by Django 4.2 on 2024-03-30 13:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stock', '0003_alter_item_item_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='item_type',
            field=models.CharField(choices=[('revision', 'Rev/Diag.'), ('prod', 'Producto'), ('concept', 'Concepto'), ('repair', 'Reparación'), ('maintenace', 'Mtto'), ('install', 'Instal/Mont'), ('unmounting', 'Desmontaje')], max_length=11, verbose_name='Tipo'),
        ),
    ]
