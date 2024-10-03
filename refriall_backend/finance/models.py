"""finance models"""

# django
from django.db import models
from django.db.models import F, Sum

# local
from hr.models import Customer, CustomerDependency, Provider
from stock.models import Item, ItemOrder, Kit


class Currency(models.Model):
    name = models.CharField('Nombre', max_length=4, unique=True)
    description = models.CharField(max_length=22, blank=True, null=True)

    class Meta:
        verbose_name = 'Moneda'
        verbose_name_plural = 'Monedas'

    def __str__(self) -> str:
        return self.name


class Bill(models.Model):
    """Final document to register the business income"""

    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, null=True, verbose_name="Cliente")
    folio = models.CharField('No. folio', max_length=10, unique=True)
    provider = models.ForeignKey(
        Provider,
        on_delete=models.PROTECT,
        null=True,
        verbose_name='Prestador'
    )
    provider_signature_date = models.DateField('Firma del proveedor')
    customer_signature_date = models.DateField('Firma del cliente', null=True)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name="bills")

    # General but not required information
    check_number = models.CharField('Nro. de Cheque', max_length=35, null=True, blank=True)
    charge_aprove = models.CharField('Cargo aprueba', max_length=35, null=True, blank=True)
    charge_check = models.CharField('Cargo revisa', max_length=35, null=True, blank=True)
    customer_charge = models.CharField('Cargo', max_length=25, null=True, blank=True)
    customer_name = models.CharField('Nombre', max_length=25, null=True, blank=True)
    customer_personal_id = models.CharField('No. CI', max_length=11, null=True, blank=True)
    checked_by = models.CharField('Revisado por', max_length=35, null=True, blank=True)
    aproved_by = models.CharField('Aprobado por', max_length=35, null=True, blank=True)

    class Meta:
        ordering = ['provider_signature_date']
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
    
    def __str__(self):
        """Returns  the string object representation"""
        return self.customer.name
    
    @property
    def get_orders(self):
        return self.orders.all()
    
    @property
    def get_orders_folio(self):
        return self.get_orders.values('folio')
    
    @property
    def get_total_amount(self):
        """Returns the Sum of the total price of the orders in this Bill"""
        total_amount = self.get_orders.aggregate(
            total = Sum(F("itemtimeorder__item__price") * F("itemtimeorder__times"))
        ).get("total", 0)
        
        return round(total_amount, 2) if total_amount is not None else 0
    
    @property
    def get_total_amount_revision(self):
        """Returns the Sum of the total price of products of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_revision = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="revision")

        if itemstimes_revision.count() > 0:
            total_revision = itemstimes_revision.aggregate(
                total_sum_revision = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_revision", 0)

            return round(total_revision, 2)
        else:
            return 0
    
    @property
    def get_total_amount_prod(self):
        """Returns the Sum of the total price of products of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_prod = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="prod")

        if itemstimes_prod.count() > 0:
            total_prod = itemstimes_prod.aggregate(
                total_sum_prod = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_prod", 0)

            return round(total_prod, 2)
        else:
            return 0

    
    @property
    def get_total_amount_concept(self):
        """Returns the Sum of the total price of concepts of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_concept = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="concept")

        if itemstimes_concept.count() > 0:
            total_concept = itemstimes_concept.aggregate(
                total_sum_concept = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_concept", 0)

            return round(total_concept, 2)
        else:
            return 0
    
    @property
    def get_total_amount_repair(self):
        """Returns the Sum of the total price of repairs of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_repair = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="repair")

        if itemstimes_repair.count() > 0:
            total_repair = itemstimes_repair.aggregate(
                total_sum_repair = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_repair", 0)

            return round(total_repair, 2)
        else:
            return 0
    
    @property
    def get_total_amount_maintenace(self):
        """Returns the Sum of the total price of maintenance of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_maintenace = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="maintenace")

        if itemstimes_maintenace.count() > 0:
            total_maintenace = itemstimes_maintenace.aggregate(
                total_sum_maintenace = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_maintenace", 0)

            return round(total_maintenace, 2)
        else:
            return 0
    
    @property
    def get_total_amount_install(self):
        """Returns the Sum of the total price of installs of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_install = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="install")
        
        if itemstimes_install.count() > 0:
            total_install = itemstimes_install.aggregate(
                total_sum_install = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_install", 0)

            return round(total_install, 2)
        else:
            return 0
    
    @property
    def get_total_amount_unmounting(self):
        """Returns the Sum of the total price of unmounting of the orders in this Bill"""
        orders_ids = self.get_orders.values("id")
        itemstimes_unmounting = ItemTimeOrder.objects.filter(order_id__in=orders_ids).filter(item__item_type="unmounting")

        if itemstimes_unmounting.count() > 0:
            total_unmounting = itemstimes_unmounting.aggregate(
                total_sum_unmounting = Sum(
                    F("item__price") * F("times")
                )
            ).get("total_sum_unmounting", 0)

            return round(total_unmounting, 2)
        else:
            return 0


class Order(models.Model):
    """Pre Bill document to register job details performed"""
    SUPPORT_TYPE = [
        ('t', 'Taller'),
        ('i', 'In Situ'),
    ]

    bill = models.ForeignKey(Bill, on_delete=models.SET_NULL, null=True, related_name='orders')
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, null=True, verbose_name="Cliente")
    customer_dependency = models.ForeignKey(CustomerDependency, on_delete=models.PROTECT, null=True, verbose_name="Dependencia")
    symptom = models.CharField('Síntoma', max_length=100)
    flaw = models.CharField('Defecto', max_length=100)
    repair_description = models.CharField('Reparación', max_length=100)
    folio = models.CharField('No. folio', max_length=10, unique=True)
    # next four attributes are related to the modality of the order
    check_diagnosis = models.BooleanField('Revisión/Diagnóstico')
    repair = models.BooleanField('Reparación')
    install = models.BooleanField('Instal./Mont./Desmont.')
    maintenance = models.BooleanField('Mtto')
    # end of modality set
    support = models.CharField(max_length=1, choices=SUPPORT_TYPE)
    kit = models.ForeignKey(Kit, on_delete=models.PROTECT, null=True, verbose_name="Equipo")
    kit_brand = models.CharField('Marca', max_length=20)
    kit_model = models.CharField('Modelo', max_length=20)
    kit_serial = models.CharField('No. de serie o Inv.', max_length=30)
    job_description = models.TextField('Descripción del trabajo realizado', blank=True, null=True)
    items = models.ManyToManyField(
        Item,
        through='ItemTime',
        verbose_name='Artículo o Servicio',
        editable=False,
        blank=True
    )
    items_order = models.ManyToManyField(
        ItemOrder,
        through='ItemTimeOrder',
        verbose_name='Artículo o Servicio',
        editable=False,
        blank=True
    )
    provider = models.ForeignKey(
        Provider,
        on_delete=models.PROTECT,
        null=True,
        verbose_name='Prestador'
    )
    provider_signature_date = models.DateField('Firma del proveedor')
    customer_signature_date = models.DateField('Firma del cliente', blank=True, null=True)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, related_name='orders')

    # General but not required information
    check_number = models.CharField('Nro. de Cheque', max_length=35, null=True, blank=True)
    charge_aprove = models.CharField('Cargo aprueba', max_length=35, null=True, blank=True)
    charge_check = models.CharField('Cargo revisa', max_length=35, null=True, blank=True)
    customer_charge = models.CharField('Cargo', max_length=25, null=True, blank=True)
    customer_name = models.CharField('Nombre', max_length=25, null=True, blank=True)
    customer_personal_id = models.CharField('No. CI', max_length=11, null=True, blank=True)
    checked_by = models.CharField('Revisado por', max_length=35, null=True, blank=True)
    aproved_by = models.CharField('Aprobado por', max_length=35, null=True, blank=True)

    class Meta:
        ordering = ['provider_signature_date']
        verbose_name = 'Orden de Servicio'
        verbose_name_plural = 'Órdenes de Servicio'
    
    def __str__(self):
        """Returns  the string object representation"""
        if self.customer:
            return self.customer.name
        else:
            return self.customer_dependency.name
    
    def delete(self, *args, **kwargs):
        self.items_order.all().delete()
        super().delete(*args, **kwargs)
    
    @property
    def get_total_amount(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount = self.itemtimeorder_set.all().aggregate(
            total=models.Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount, 2) if total_amount is not None else 0
    
    @property
    def get_total_amount_revision(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_revision = self.itemtimeorder_set.filter(item__item_type='revision').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_revision, 2) if total_amount_revision is not None else 0
    
    @property
    def get_total_amount_prod(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_prod = self.itemtimeorder_set.filter(item__item_type='prod').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_prod, 2) if total_amount_prod is not None else 0
    
    @property
    def get_total_amount_concept(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_concept = self.itemtimeorder_set.filter(item__item_type='concept').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_concept, 2) if total_amount_concept is not None else 0
    
    @property
    def get_total_amount_repair(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_repair = self.itemtimeorder_set.filter(item__item_type='repair').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_repair, 2) if total_amount_repair is not None else 0
    
    @property
    def get_total_amount_maintenace(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_maintenace = self.itemtimeorder_set.filter(item__item_type='maintenace').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_maintenace, 2) if total_amount_maintenace is not None else 0
    
    @property
    def get_total_amount_install(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_install = self.itemtimeorder_set.filter(item__item_type='install').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_install, 2) if total_amount_install is not None else 0
    
    @property
    def get_total_amount_unmounting(self):
        """Returns the Sum of the prices of the items multiplied by the times of the related object ItemTime related through ItemTime objects"""
        total_amount_unmounting = self.itemtimeorder_set.filter(item__item_type='unmounting').aggregate(
            total=Sum(F('item__price') * F('times'))
        ).get('total')

        return round(total_amount_unmounting, 2) if total_amount_unmounting is not None else 0
    
    @property
    def get_order_support(self):
        return self.get_support_display()
    

class ItemTime(models.Model):
    """Class to register how many items go in an order"""
    item = models.ForeignKey(Item, on_delete=models.PROTECT, verbose_name="Artículo", null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    times = models.FloatField('Cantidad', default=1)

    class Meta:
        verbose_name = 'Cantidad de Artículo'
        verbose_name_plural = 'Cantidades de Artículo'
    
    def __str__(self):
        """Returns  the string object representation"""
        return f'{self.item.name} - {self.order.customer.name}'
    
    def get_sub_total(self):
        """Multiplies the price of the item to the times attribute"""
        return self.item.price * self.times


class ItemTimeOrder(models.Model):
    """
    Class to register how many items go in an order, it'll be related with the ItemOrder model
    to isolate the price updating
    """
    item = models.ForeignKey(ItemOrder, on_delete=models.CASCADE, verbose_name="Artículo", null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)
    times = models.FloatField('Cantidad', default=1)

    class Meta:
        verbose_name = 'Cantidad de Artículo'
        verbose_name_plural = 'Cantidades de Artículo'
    
    def __str__(self):
        """Returns  the string object representation"""
        return f'{self.item.name} - {self.order.customer.name}'