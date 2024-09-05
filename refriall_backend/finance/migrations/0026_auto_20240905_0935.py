"""Data migration required due to the existence of information in the database by the time the change was requested"""

# django
from django.db import migrations, models

def currency_to_orders(apps, schema_editor):
    Order = apps.get_model("finance", "Order")
    Currency = apps.get_model("finance", "Currency")

    orders = Order.objects.all()
    

    if orders.count() > 0:
        currency = Currency.objects.create(
            name='CUP',
            description='Peso Cubano'
        )

        for order in orders:
            order.currency = currency
            order.save()


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0025_alter_order_kit_serial'),
    ]

    operations = [
        # Create the Currency model
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=4)),
                ('description', models.CharField(max_length=22, blank=True, null=True)),
            ]
        ),
        # Add nullable currency relationship to Order
        migrations.AddField(
            model_name='Order',
            name='currency',
            field=models.ForeignKey(
                to='finance.Currency',
                on_delete=models.PROTECT,
                related_name='orders',
                null=True
            )
        ),
        # Create and assign a first currency to all orders if there are any
        migrations.RunPython(currency_to_orders),
        # Set currency Order attribute as non null
        migrations.AlterField(
            model_name='Order',
            name='currency',
            field=models.ForeignKey(
                to='finance.Currency',
                on_delete=models.PROTECT,
                related_name='orders',
                null=False
            )
        )
    ]
