# Generated by Django 4.2 on 2024-01-30 02:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0007_bill'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='bill',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='orders', to='finance.bill'),
        ),
    ]
