"""hr test module for Customer model and corresponding operations"""

# local
from ..models import Customer, CustomerDependency
from ..serializers import CustomerSerializer
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
        self.test_dependncy = create_object_helper(
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