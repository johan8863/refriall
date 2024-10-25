"""stock test module for Customer model and corresponding operations"""

# local
from ..models import Customer
from ..serializers import CustomerSerializer
from project.tests.base import ModelTest, ModelApiTest, create_object_helper


class CustomerModelTests(ModelTest):
    """Class used to test Customer CRUD and validation operations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.test_customer = create_object_helper(
            Customer,
            customer_type='es',
            name='Aeropuerto',
            address='Carretara La Fe km 1/4',
            province='ijv',
            township='ijv',
            code='25100',
            client_nit='45214',
            bank_account_header='Titular Aeropuerto',
            bank_account='56987523'
        )
        self.test_inmemory_customer = Customer(
            customer_type='es',
            name='Hospital',
            address='Calle 39A e/ 41 y 45 ',
            province='ijv',
            township='ijv',
            code='25100',
            client_nit='6598',
            bank_account_header='Titular Hospital',
            bank_account='6548221'
        )
    

    # CRUD tests.
    def test_create_customer(self):
        self.create_object(
            Customer,
            customer_type='es',
            name='Hospital',
            address='Calle 39A e/ 41 y 45 ',
            province='ijv',
            township='ijv',
            code='25100',
            client_nit='6598',
            bank_account_header='Titular Hospital',
            bank_account='6548221'
        )

    def test_read_customer(self):
        self.read_object(Customer, self.test_customer, name='Aeropuerto')
    
    def test_update_customer(self):
        self.update_object(self.test_customer, 'name', 'Hospital')
    
    def test_delete_customer(self):
        self.delete_object(Customer, self.test_customer)
    
    # Validation tests.
    def test_create_duplicate_customer(self):
        self.create_duplicate_object(Customer, name=self.test_customer.name)

class CustomerAPITests(ModelApiTest):
    """Class to test the Customer api rest operations and validations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.base_setup('customers')
        self.test_customer = {
            'customer_type': 'es',
            'name': 'Aeropuerto',
            'address': 'Carretara La Fe km 1/4',
            'province': 'ijv',
            'township': 'ijv',
            'code': '25100',
            'client_nit': '45214',
            'bank_account_header': 'Titular Aeropuerto',
            'bank_account': '56987523'
        }
        
    # CRUD tests.
    def test_create_customer(self):
        self.create_object(Customer, self.test_customer)

    def test_read_customer(self):
        self.read_object(
            Customer,
            'code',
            self.test_customer
        )
    
#     def test_update_customer(self):
#         self.update_object(
#             Customer,
#             CustomerSerializer,
#             'name',
#             'Silver Weld',
#             code="RO-0007",
#             name="Refrigeration Oil",
#             customer_type="prod",
#             measurement="lts",
#             price=61.63
#         )
    
#     def test_delete_customer(self):
#         self.delete_object(Customer, **self.test_customer)
    
#     # Validation tests.
#     def test_create_duplicate_customer(self):
#         self.create_duplicate_object(Customer, self.test_customer)
