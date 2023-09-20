# Generated by Django 4.2 on 2023-09-20 02:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('hr', '0001_initial'),
        ('stock', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ItemTime',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('times', models.FloatField(default=1, verbose_name='Cantidad')),
                ('item', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='stock.item', verbose_name='Artículo')),
            ],
            options={
                'verbose_name': 'Cantidad de Artículo',
                'verbose_name_plural': 'Cantidades de Artículo',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symptom', models.CharField(max_length=100, verbose_name='Síntoma')),
                ('flaw', models.CharField(max_length=100, verbose_name='Defecto')),
                ('repair_description', models.CharField(max_length=100, verbose_name='Reparación')),
                ('folio', models.CharField(max_length=10, verbose_name='No. folio')),
                ('check_diagnosis', models.BooleanField(verbose_name='Revisión/Diagnóstico')),
                ('repair', models.BooleanField(verbose_name='Reparación')),
                ('install', models.BooleanField(verbose_name='Instal./Mont./Desmont.')),
                ('maintenance', models.BooleanField(verbose_name='Mtto')),
                ('kit_brand', models.CharField(max_length=20, verbose_name='Marca')),
                ('kit_model', models.CharField(max_length=20, verbose_name='Modelo')),
                ('kit_serial', models.CharField(max_length=20, verbose_name='No. de serie o Inv.')),
                ('job_description', models.TextField(blank=True, null=True, verbose_name='Descripción del trabajo realizado')),
                ('provider_signature_date', models.DateField(verbose_name='Firma del proveedor')),
                ('customer_signature_date', models.DateField(verbose_name='Firma del cliente')),
                ('check_number', models.CharField(blank=True, max_length=35, null=True, verbose_name='Nro. de Cheque')),
                ('charge_aprove', models.CharField(blank=True, max_length=35, null=True, verbose_name='Cargo aprueba')),
                ('charge_check', models.CharField(blank=True, max_length=35, null=True, verbose_name='Cargo revisa')),
                ('customer_charge', models.CharField(blank=True, max_length=25, null=True, verbose_name='Cargo')),
                ('customer_name', models.CharField(blank=True, max_length=25, null=True, verbose_name='Nombre')),
                ('customer_personal_id', models.CharField(blank=True, max_length=11, null=True, verbose_name='No. CI')),
                ('checked_by', models.CharField(blank=True, max_length=35, null=True, verbose_name='Revisado por')),
                ('aproved_by', models.CharField(blank=True, max_length=35, null=True, verbose_name='Aprobado por')),
                ('customer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='hr.customer', verbose_name='Cliente')),
                ('items', models.ManyToManyField(blank=True, editable=False, through='finance.ItemTime', to='stock.item', verbose_name='Artículo o Servicio')),
                ('kit', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='stock.kit', verbose_name='Equipo')),
                ('provider', models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL, verbose_name='Prestador')),
            ],
            options={
                'verbose_name': 'Orden de Servicio',
                'verbose_name_plural': 'Órdenes de Servicio',
                'ordering': ['provider_signature_date'],
            },
        ),
        migrations.AddField(
            model_name='itemtime',
            name='order',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='finance.order'),
        ),
    ]
