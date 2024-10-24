"""stock test module"""

# django
from django.db.utils import IntegrityError
from django.test import TestCase
from django.urls import reverse

# rest_framework
from rest_framework import status
from rest_framework.test import APITestCase

# local
from .models import Kit


class KitModelTests(TestCase):
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


class KitAPITests(APITestCase):
    """Class to test the Kit api rest operations and validations"""

    def setUp(self):
        """Initial fixtures for these, tests"""
        self.base_url = 'kits'
        self.list_url = reverse(self.base_url + '-list')
        self.test_kit = {
            'name': 'Split'
        }

    def get_url(self, id):
        """URL used for get, put and delete methods"""
        return reverse(viewname=self.base_url + '-detail', args=(id,))
    

    def test_create_kit(self):
        """
        When `posting` a Kit object must return a status code of 201,
        then the amount of object must increase by 1
        """
        kit_count_before = Kit.objects.count()
        response = self.client.post(self.list_url, self.test_kit, format='json')
        kit_count_after = Kit.objects.count()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(kit_count_after, kit_count_before + 1)

    def test_read_kit(self):
        """
        Retrieving a Kit object must give a 200 status code 
        response and match the source attributes.
        """
        kit = Kit.objects.create(**self.test_kit)
        response = self.client.get(self.get_url(kit.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], kit.name)
    
    def test_update_kit(self):
        """
        After of updating a Kit object, a status code 200 response must be given and
        the new kit attrs must match the provided ones.
        """
        kit = Kit.objects.create(**self.test_kit)        
        updated_kit_data = { 'name': 'Oven' }
        response = self.client.put(self.get_url(kit.id), updated_kit_data, format='json')
        updated_kit_object = Kit.objects.get(id=kit.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], updated_kit_object.name)
    
    def test_delete_kit(self):
        """
        Deleting a Kit object must return a status code response 204
        and the amount of Kit objects must decrease by 1
        """
        kit = Kit.objects.create(**self.test_kit)
        kit_before_count = Kit.objects.count()
        response = self.client.delete(self.get_url(kit.id), format='json')
        kit_after_count = Kit.objects.count()
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(kit_after_count, kit_before_count - 1)
    
    def test_create_duplicate_kit(self):
        """
        Trying to create a duplicated Kit name must return a status code 400
        and an error in the name attr.
        """
        Kit.objects.create(**self.test_kit)
        response = self.client.post(self.list_url, self.test_kit, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['name'][0], 'Ya existe Equipo con este Nombre.')
