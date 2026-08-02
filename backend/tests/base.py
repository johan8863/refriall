"""Base Test Classes for the current project apps models CRUD operations and validations"""

# django
from django.db.utils import IntegrityError
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

# rest_framework
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


def create_object_helper(class_name, **kwargs):
    """
    Creates a django object of the type `class_name` with the given kwargs
    
    Args:
        class_name: Model class to instantiate
        **kwargs: Model field values
    
    Returns:
        Model instance or None if creation fails
    """
    try:
        return class_name.objects.create(**kwargs)
    except IntegrityError as integrity_error:
        print(f"IntegrityError: {integrity_error}")
        return None
    except Exception as generic_exception:
        print(f"Unexpected error: {generic_exception}")
        return None


def get_object_helper(class_name, **kwargs):
    """
    Retrieves an object with the given attrs in kwargs
    
    Args:
        class_name: Model class to query
        **kwargs: Filter criteria
    
    Returns:
        Model instance or None if not found
    """
    try:
        return class_name.objects.get(**kwargs)
    except class_name.DoesNotExist as dnot_exist:
        print(f"DoesNotExist: {dnot_exist}")
        return None
    except Exception as generic_exception:
        print(f"Unexpected error: {generic_exception}")
        return None


class ModelTest(TestCase):
    """Base class for testing model CRUD operations and validations"""
    
    # CRUD Tests
    def create_object(self, class_name, **kwargs):
        """
        Test object creation.
        
        Verifies:
        1. Created object is an instance of the model
        2. Object count increases by exactly 1
        """
        object_count_before = class_name.objects.count()
        created_object = class_name.objects.create(**kwargs)
        object_count_after = class_name.objects.count()
        
        self.assertIsInstance(created_object, class_name)
        self.assertEqual(object_count_after, object_count_before + 1)
        return created_object
    
    def read_object(self, class_name, test_object, **kwargs):
        """
        Test object retrieval.
        
        Verifies:
        Retrieved object matches the source object
        """
        retrieved_object = class_name.objects.get(**kwargs)
        self.assertEqual(retrieved_object, test_object)
        return retrieved_object
    
    def update_object(self, test_object, test_attr, test_value):
        """
        Test object update.
        
        Verifies:
        Updated attribute matches the new value
        """
        setattr(test_object, test_attr, test_value)
        test_object.save()
        self.assertEqual(getattr(test_object, test_attr), test_value)
        return test_object
    
    def delete_object(self, class_name, test_object):
        """
        Test object deletion.
        
        Verifies:
        Attempting to retrieve deleted object raises DoesNotExist
        """
        test_object_id = test_object.id
        test_object.delete()
        
        with self.assertRaises(class_name.DoesNotExist):
            class_name.objects.get(id=test_object_id)
    
    # Validation Tests
    def create_duplicate_object(self, class_name, **kwargs):
        """
        Test duplicate object creation prevention.
        
        Verifies:
        Creating an object with duplicate unique fields raises IntegrityError
        """
        with self.assertRaises(IntegrityError):
            class_name.objects.create(**kwargs)


class ModelApiTest(APITestCase):
    """Base class for testing API CRUD operations and validations"""
    
    def base_setup(self, basename, authenticate=True):
        """
        Setup API test environment.
        
        Args:
            basename: Router basename for the model (e.g., 'customers', 'items')
            authenticate: Whether to authenticate the client
        """
        self.base_url = basename
        self.list_url = reverse(basename + '-list')
        
        if authenticate:
            self.setup_authentication()
    
    def setup_authentication(self):
        """Setup test user and JWT authentication"""
        self.test_user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.access_token = str(AccessToken.for_user(self.test_user))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
    
    def get_url(self, id):
        """Get detail URL for a specific object"""
        return reverse(viewname=self.base_url + '-detail', args=(id,))
    
    def create_object(self, class_name, test_object):
        """
        Test API object creation.
        
        Verifies:
        1. Response status 201 Created
        2. Object count increases by exactly 1
        """
        object_count_before = class_name.objects.count()
        response = self.client.post(self.list_url, test_object, format='json')
        object_count_after = class_name.objects.count()
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(object_count_after, object_count_before + 1)
        return response
    
    def read_object(self, class_name, test_attr, test_object):
        """
        Test API object retrieval.
        
        Verifies:
        1. Response status 200 OK
        2. Retrieved data matches the source object
        """
        created_object = create_object_helper(class_name, **test_object)
        response = self.client.get(self.get_url(created_object.id), format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[test_attr], getattr(created_object, test_attr))
        return response
    
    def update_object(self, class_name, serializer_class, test_attr, test_value, test_object):
        """
        Test API object update.
        
        Verifies:
        1. Response status 200 OK
        2. Updated data matches the new values
        """
        created_object = create_object_helper(class_name, **test_object)
        setattr(created_object, test_attr, test_value)
        object_serialized_data = serializer_class(created_object).data
        response = self.client.put(
            self.get_url(created_object.id),
            object_serialized_data,
            format='json'
        )
        updated_object = get_object_helper(class_name, id=created_object.id)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[test_attr], getattr(updated_object, test_attr))
        return response
    
    def delete_object(self, class_name, **kwargs):
        """
        Test API object deletion.
        
        Verifies:
        1. Response status 204 No Content
        2. Object count decreases by exactly 1
        """
        created_object = create_object_helper(class_name, **kwargs)
        object_before_count = class_name.objects.count()
        response = self.client.delete(self.get_url(created_object.id), format='json')
        object_after_count = class_name.objects.count()
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(object_after_count, object_before_count - 1)
        return response
    
    def create_duplicate_object(self, class_name, serializer_class, test_object):
        """
        Test duplicate object creation prevention via API.
        
        Verifies:
        1. Response status 400 Bad Request
        2. Error response keys are a subset of object keys
        """
        created_object = create_object_helper(class_name, **test_object)
        object_serialized_data = serializer_class(created_object).data
        response = self.client.post(self.list_url, object_serialized_data, format='json')
        
        test_object_keys_set = set(test_object.keys())
        response_keys_set = set(response.data.keys())
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response_keys_set.issubset(test_object_keys_set))
        return response
