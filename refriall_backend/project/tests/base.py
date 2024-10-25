"""Base Test Classes for the current project apps models CRUD operations and validations"""

# django
from django.db.utils import IntegrityError
from django.test import TestCase
from django.urls import reverse

# rest_framework
from rest_framework import status
from rest_framework.test import APITestCase

def create_object_helper(class_name, **kwargs):
    """Creates a django object of the type `class_name` with the given kwargs"""
    try:
        return class_name.objects.create(**kwargs)
    except IntegrityError as integrity_error:
        print(integrity_error)
    except Exception as generic_exception:
        print(generic_exception)

def get_object_helper(class_name, **kwargs):
    """Retrieves an object with the given attrs in kwargs"""
    try:
        return class_name.objects.get(**kwargs)
    except class_name.DoesNotExist as dnot_exist:
        print(dnot_exist)
    except Exception as generic_exception:
        print(generic_exception)

class ModelTest(TestCase):
    """Class used to test model CRUD and validation operations"""

    # CRUD Tests
    def create_object(self, class_name, **kwargs):
        """
        When creating an object, first, it must be a class_name instance, second the amount
        of objects must be increased by one.
        """
        # inputs
        object_count_before = class_name.objects.count()
        created_object = class_name.objects.create(**kwargs)
        object_count_after = class_name.objects.count()
        # assertions
        self.assertIsInstance(created_object, class_name)
        self.assertEqual(object_count_after, object_count_before + 1)
    
    def read_object(self, class_name, test_object, **kwargs):
        """
        Retrieving an object by some of its unique attributes must match the source object.
        """
        # inputs
        retrieved_object = class_name.objects.get(**kwargs)
        # assertions
        self.assertEqual(retrieved_object, test_object)

    def update_object(self, test_object, test_attr, test_value):
        """
        After of updating any attribute of the object, 
        it must match with the new value.
        """
        # inputs
        setattr(test_object, test_attr, test_value)
        test_object.save()
        # assertions
        self.assertEqual(getattr(test_object, test_attr), test_value)
    
    def delete_object(self, class_name, test_object):
        """
        If an object is deleted, trying to retrieve it must raise an exception.
        """
        # watching exception raising
        with self.assertRaises(class_name.DoesNotExist):
            # inputs
            test_object_id = test_object.id
            test_object.delete()
            # assertions
            deleted_object = class_name.objects.get(id=test_object_id)
            self.assertIsNone(deleted_object)
    
    # Validation tests.
    def create_duplicate_object(self, class_name, **kwargs):
        """
        Creatig a duplicated object name must raise an exception.
        """
        # watching exception raising
        with self.assertRaises(IntegrityError):
            # inputs
            duplicated_object = class_name.objects.create(**kwargs)
            # assertions
            self.assertIsNone(duplicated_object)


class ModelApiTest(APITestCase):
    """Class to test a model api rest operations and validations"""

    def base_setup(self, basename):
        # If the routes for a model views were generated with the default router of
        # django rest framework, the routes are grouped by methods. 
        # For a better understanding of why the asbtraction of a base url, 
        # a list url and the get_url helper function, point a browser at:
        # https://www.django-rest-framework.org/api-guide/routers/#defaultrouter
        self.base_url = basename
        self.list_url = reverse(basename + '-list')
    
    def get_url(self, id):
        """URL used for get, put and delete methods"""
        return reverse(viewname=self.base_url + '-detail', args=(id,))
    
    def create_object(self, class_name, test_object):
        """
        When `posting` an object must return a status code of 201,
        then the amount of object must increase by 1
        """
        # inputs
        object_count_before = class_name.objects.count()
        response = self.client.post(self.list_url, test_object, format='json')
        object_count_after = class_name.objects.count()
        # assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(object_count_after, object_count_before + 1)

    def read_object(self, class_name, test_attr, test_object):
        """
        Retrieving an object must give a 200 status code 
        response and match the source attributes.
        """
        # inputs
        created_object = create_object_helper(class_name, **test_object)
        response = self.client.get(self.get_url(created_object.id), format='json')
        # assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[test_attr], created_object.__getattribute__(test_attr))
    
    def update_object(self, class_name, serializer_class, test_attr, test_value, test_object):
        """
        After of updating an object, a status code 200 response must be given and
        the new object attrs must match the provided ones.
        """
        # inputs
        created_object = create_object_helper(class_name, **test_object)
        setattr(created_object, test_attr, test_value)
        object_serialized_data = serializer_class(created_object).data
        response = self.client.put(self.get_url(created_object.id), object_serialized_data, format='json')
        updated_object = get_object_helper(class_name, id=created_object.id)
        # assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[test_attr], updated_object.__getattribute__(test_attr))
    
    def delete_object(self, class_name, **kwargs):
        """
        Deleting an object must return a status code response 204
        and the amount of objects must decrease by 1
        """
        # inputs
        created_object = create_object_helper(class_name, **kwargs)
        object_before_count = class_name.objects.count()
        response = self.client.delete(self.get_url(created_object.id), format='json')
        object_after_count = class_name.objects.count()
        # assertions
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(object_after_count, object_before_count - 1)
    
    # Validation tests.
    def create_duplicate_object(self, class_name, test_object):
        """
        Trying to create a duplicated object name must return a status code 400.
        """
        # inputs

        # When trying to create an object with an attr that already exists,
        # the response will have a status code of 400 but also an error message 
        # in the key with the same name as the duplicated attr.
        create_object_helper(class_name, **test_object)
        response = self.client.post(self.list_url, test_object, format='json')
        # extracting keys
        test_object_keys = test_object.keys()
        response_keys = response.data.keys()
        # turning the keys into sets to test that the response key is a subset
        # of the object keys
        test_object_keys_set = set(test_object_keys)
        response_keys_set = set(response_keys)
        # assertions
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response_keys_set.issubset(test_object_keys_set))
