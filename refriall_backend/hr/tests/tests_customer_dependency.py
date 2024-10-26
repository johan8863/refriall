"""hr test module for Customer model and corresponding operations"""

# local
from ..models import Customer, CustomerDependency
from ..serializers import CustomerDependencySerializer
from project.tests.base import ModelTest, ModelApiTest, create_object_helper


class CustomerDependencyModelTests(ModelTest):
    """Class used to test CustomerDependncy CRUD and validation operations"""
    # fixtures can be generated from the database by excecuting 
    # "python manage.py dumpdata [app_label[.ModelName] [app_label[.ModelName] ...]]"
    # as mentioned in these Django Documentation Topics
    # https://docs.djangoproject.com/en/4.2/topics/db/fixtures/#how-to-produce-a-fixture
    # https://docs.djangoproject.com/en/4.2/ref/django-admin/#django-admin-dumpdata
    fixtures = ['customers.json']

    def setUp(self):
        """Initial fixtures for these tests"""
        # After of loading fixtures generated from the database you can use them throug
        # the django models api
        self.test_customer = Customer.objects.first()
        self.test_dependency = create_object_helper(
            CustomerDependency,
            customer=self.test_customer,
            name='Dependency 1',
            address='Address Dependecy 1',
            province='ijv',
            township='ijv'
        )

    def test_create_customer_dependency(self):
        self.create_object(
            CustomerDependency,
            customer=self.test_customer,
            name='Dependency 2',
            address='Address Dependecy 2',
            province='ijv',
            township='ijv'
        )
    
    def test_read_customer_dependency(self):
        self.read_object(CustomerDependency, self.test_dependency, id=self.test_dependency.id)
    
    def test_update_customer_dependency(self):
        self.update_object(self.test_dependency, 'name', 'Dependency uptaded')
    
    def test_delete_customer_dependency(self):
        self.delete_object(CustomerDependency, self.test_dependency)
    
    # # Validation tests.
    def test_create_duplicate_customer(self):
        self.create_duplicate_object(CustomerDependency, name=self.test_dependency.name)


class CustomerDependencyAPITests(ModelApiTest):
    """Class used to test CustomerDependncy api CRUD and validation operations"""
    fixtures = ['customers.json']

    def setUp(self):
        """Initial fixtures for these tests"""
        self.base_setup('dependencies')
        self.test_customer = Customer.objects.first()
        self.test_dependency_create = {
            'customer': self.test_customer.id,
            'name': 'Dependency 1',
            'address': 'Address Dependecy 1',
            'province': 'ijv',
            'township': 'ijv'
        }
        
        self.test_dependency_read = {
            'customer': self.test_customer,
            'name': 'Dependency 1',
            'address': 'Address Dependecy 1',
            'province': 'ijv',
            'township': 'ijv'
        }
        
    # CRUD tests.
    def test_create_customer_dependency(self):
        self.create_object(CustomerDependency, self.test_dependency_create)

    def test_read_customer_dependecy(self):
        self.read_object(
            CustomerDependency,
            'id',
            self.test_dependency_read
        )
    
    def test_update_customer(self):
        self.update_object(
            CustomerDependency,
            CustomerDependencySerializer,
            'name',
            'Dependency updated',
            self.test_dependency_read
        )
    
    def test_delete_customer(self):
        self.delete_object(CustomerDependency, **self.test_dependency_read)
    
    # # Validation tests.
    def test_create_duplicate_customer_dependency(self):
        self.create_duplicate_object(CustomerDependency, CustomerDependencySerializer, self.test_dependency_read)
