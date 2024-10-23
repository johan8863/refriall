"""stock test module"""

# django
from django.db.utils import IntegrityError
from django.test import TestCase

# local
from .models import Kit


class KitModelTest(TestCase):
    """Class used to test Kit CRUD and validation operations"""

    def setUp(self):
        """Initial fixtures for these, tests"""
        self.test_kit = Kit.objects.create(name="Split")
    

    def test_create_kit(self):
        """
        When creating a Kit object, first, it must be a Kit instance, second the amount
        of books must be increased by one.
        """

        kit_count_before = Kit.objects.count()
        created_kit = Kit.objects.create(name="Refrigerator")
        kit_count_after = Kit.objects.count()

        self.assertIsInstance(created_kit, Kit)
        self.assertEqual(kit_count_after, kit_count_before + 1)
    
    def test_read_kit(self):
        """
        Retrieving a Kit by some of its unique attributes must match the source Kit.
        """

        retrieved_kit = Kit.objects.get(name="Split")
        self.assertEqual(retrieved_kit.name, self.test_kit.name)
    
    def test_update_kit(self):
        """
        After of updating any attribute of the Kit object, 
        it must match with the new value.
        """

        self.test_kit.name = "Oven"
        self.test_kit.save()

        self.assertEqual(self.test_kit.name, "Oven")
    
    def test_delete_kit(self):
        """
        If a Kit object is deleted, trying to retrieve it must raise an exception.
        """

        with self.assertRaises(Kit.DoesNotExist):
            test_kit_id = self.test_kit.id
            self.test_kit.delete()

            deleted_kit = Kit.objects.get(id=test_kit_id)
            self.assertIsNone(deleted_kit)
    
    def test_create_duplicate_kit(self):
        """
        Creatig a duplicated kit name must raise an exception.
        """
        with self.assertRaises(IntegrityError):
            duplicated_kit = Kit.objects.create(name=self.test_kit.name)
            self.assertIsNone(duplicated_kit)
