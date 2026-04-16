from project.wsgi import *

from finance.models import Order

# order = Order.objects.get(folio='2500010')
# order.delete()
# print(order)

from hr.models import Customer

customer = Customer.objects.get(pk=2)
customer.delete()
# print(customer)