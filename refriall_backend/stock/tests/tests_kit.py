"""stock test module for Kit model and corresponding operations"""
# rest_framework
from ..serializers import KitSerializer

# local
from ..models import Kit
from project.tests.base import ModelTest, ModelApiTest, create_object_helper


class KitModelTests(ModelTest):
    """Class used to test Kit CRUD and validation operations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.test_kit = create_object_helper(Kit, name="Split")
    

    # CRUD tests.
    def test_create_kit(self):
        self.create_object(Kit, name='Refrigerator')
    
    def test_read_kit(self):
        self.read_object(Kit, self.test_kit, name="Split")
    
    def test_update_kit(self):
        self.update_object(self.test_kit, 'name', 'Oven')
    
    def test_delete_kit(self):
        self.delete_object(Kit, self.test_kit)
    
    # Validation tests.
    def test_create_duplicate_kit(self):
        self.create_duplicate_object(Kit, name=self.test_kit.name)

class KitAPITests(ModelApiTest):
    """Class to test the Kit api rest operations and validations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.base_setup('kits')
        self.test_kit = {
            'name': 'Split'
        }
        
    # CRUD tests.
    def test_create_kit(self):
        self.create_object(Kit, self.test_kit)

    def test_read_kit(self):
        self.read_object(Kit, 'name', self.test_kit)
    
    def test_update_kit(self):
        self.update_object(Kit, KitSerializer, 'name', 'Oven', self.test_kit)
    
    def test_delete_kit(self):
        self.delete_object(Kit, **self.test_kit)
    
    # Validation tests.
    def test_create_duplicate_kit(self):
        self.create_duplicate_object(Kit, KitSerializer, self.test_kit)
