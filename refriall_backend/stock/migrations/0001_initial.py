# Generated by Django 4.2 on 2023-09-20 02:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=15, unique=True, verbose_name='Código')),
                ('name', models.CharField(max_length=120, verbose_name='Nombre')),
                ('item_type', models.CharField(choices=[('product', 'Producto'), ('concept', 'Concepto'), ('repair', 'Reparación'), ('maintenace', 'Mtto'), ('install', 'Instal/Mont'), ('unmounting', 'Desmontaje')], max_length=11, verbose_name='Tipo')),
                ('measurement', models.CharField(blank=True, choices=[('u', 'Uno'), ('m', 'Metros'), ('kg', 'Kilogramos'), ('lts', 'Litros')], max_length=3, null=True, verbose_name='Unidad de medida')),
                ('price', models.FloatField(verbose_name='Precio')),
            ],
            options={
                'verbose_name': 'Artículo',
                'verbose_name_plural': 'Artículos',
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='Kit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True, verbose_name='Nombre')),
            ],
            options={
                'verbose_name': 'Equipo',
                'verbose_name_plural': 'Equipos',
                'ordering': ['name'],
            },
        ),
    ]
