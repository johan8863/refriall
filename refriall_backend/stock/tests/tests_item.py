"""stock test module for Item model and corresponding operations"""

# local
from ..models import Item
from ..serializers import ItemSerializer
from project.tests.base import ModelTest, ModelApiTest, create_object_helper


class ItemModelTests(ModelTest):
    """Class used to test Item CRUD and validation operations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.test_item = create_object_helper(
            Item,
            code="AG-0001",
            name="Silver Weld",
            item_type="prod",
            measurement="u",
            price=36.88
        )
    

    # CRUD tests.
    def test_create_item(self):
        self.create_object(
            Item,
            code="RO-0007",
            name="Refrigeration Oil",
            item_type="prod",
            measurement="lts",
            price=61.63
        )
    
    def test_read_item(self):
        self.read_object(Item, self.test_item, code="AG-0001")
    
    def test_update_item(self):
        self.update_object(self.test_item, 'name', 'Refrigeration Oil')
    
    def test_delete_item(self):
        self.delete_object(Item, self.test_item)
    
    # Validation tests.
    def test_create_duplicate_item(self):
        self.create_duplicate_object(Item, name=self.test_item.code)

class ItemAPITests(ModelApiTest):
    """Class to test the Item api rest operations and validations"""

    def setUp(self):
        """Initial fixtures for these tests"""
        self.base_setup('items')
        self.test_item = {
            'code' :"AG-0001",
            'name' :"Silver Weld",
            'item_type' :"prod",
            'measurement' :"u",
            'price' :36.88
        }
        
    # CRUD tests.
    def test_create_item(self):
        self.create_object(Item, self.test_item)

    def test_read_item(self):
        self.read_object(
            Item,
            'code',
            code="AG-0001",
            name="Weld",
            item_type="prod",
            measurement="u",
            price=36.88
        )
    
    def test_update_item(self):
        self.update_object(
            Item,
            ItemSerializer,
            'name',
            'Silver Weld',
            code="RO-0007",
            name="Refrigeration Oil",
            item_type="prod",
            measurement="lts",
            price=61.63
        )
    
    def test_delete_item(self):
        self.delete_object(Item, **self.test_item)
    
    # Validation tests.
    def test_create_duplicate_item(self):
        self.create_duplicate_object(Item, self.test_item)
