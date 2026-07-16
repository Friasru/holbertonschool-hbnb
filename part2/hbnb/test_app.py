import unittest
import uuid
from app import create_app
from app.extensions import db

ADMIN_EMAIL = 'admin@hbnb.io'
ADMIN_PASSWORD = 'admin1234'

class TestBase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

        # Login as admin
        response = self.client.post('/api/v1/auth/login', json={
            'email': ADMIN_EMAIL,
            'password': ADMIN_PASSWORD
        })
        data = response.get_json()
        self.admin_token = data.get('access_token', '')
        self.admin_headers = {'Authorization': f'Bearer {self.admin_token}'}

    def create_regular_user(self):
        email = f'user.{uuid.uuid4()}@example.com'
        response = self.client.post('/api/v1/users/', json={
            'first_name': 'Test',
            'last_name': 'User',
            'email': email,
            'password': 'password123'
        })
        data = response.get_json()
        user_id = data['id']

        # Login as regular user
        login = self.client.post('/api/v1/auth/login', json={
            'email': email,
            'password': 'password123'
        })
        token = login.get_json().get('access_token', '')
        headers = {'Authorization': f'Bearer {token}'}
        return user_id, headers


class TestUserEndpoints(TestBase):

    def test_create_user(self):
        response = self.client.post('/api/v1/users/', json={
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': f'jane.{uuid.uuid4()}@example.com',
            'password': 'password123'
        }, headers=self.admin_headers)
        self.assertEqual(response.status_code, 201)

    def test_create_user_invalid_data(self):
        response = self.client.post('/api/v1/users/', json={
            'first_name': '',
            'last_name': '',
            'email': 'invalid-email',
            'password': 'password123'
        }, headers=self.admin_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_user_no_token(self):
        response = self.client.post('/api/v1/users/', json={
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': f'jane.{uuid.uuid4()}@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 201)

    def test_get_all_users(self):
        response = self.client.get('/api/v1/users/')
        self.assertEqual(response.status_code, 200)

    def test_get_user_not_found(self):
        response = self.client.get('/api/v1/users/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestAmenityEndpoints(TestBase):

    def test_create_amenity(self):
        response = self.client.post('/api/v1/amenities/', json={
            'name': f'WiFi-{uuid.uuid4()}'
        }, headers=self.admin_headers)
        self.assertEqual(response.status_code, 201)

    def test_create_amenity_invalid_data(self):
        response = self.client.post('/api/v1/amenities/', json={
            'name': ''
        }, headers=self.admin_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_amenity_no_token(self):
        response = self.client.post('/api/v1/amenities/', json={
            'name': 'Pool'
        })
        self.assertEqual(response.status_code, 401)

    def test_get_all_amenities(self):
        response = self.client.get('/api/v1/amenities/')
        self.assertEqual(response.status_code, 200)

    def test_get_amenity_not_found(self):
        response = self.client.get('/api/v1/amenities/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestPlaceEndpoints(TestBase):

    def setUp(self):
        super().setUp()
        self.user_id, self.user_headers = self.create_regular_user()

    def test_create_place(self):
        response = self.client.post('/api/v1/places/', json={
            'title': 'Cozy Apartment',
            'description': 'A nice place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'amenities': []
        }, headers=self.user_headers)
        self.assertEqual(response.status_code, 201)

    def test_create_place_invalid_price(self):
        response = self.client.post('/api/v1/places/', json={
            'title': 'Bad Place',
            'description': 'Invalid price',
            'price': -50.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'amenities': []
        }, headers=self.user_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_place_invalid_latitude(self):
        response = self.client.post('/api/v1/places/', json={
            'title': 'Bad Place',
            'description': 'Invalid latitude',
            'price': 100.0,
            'latitude': 200.0,
            'longitude': -122.4194,
            'amenities': []
        }, headers=self.user_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_user_no_token(self):
        response = self.client.post('/api/v1/users/', json={
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': f'jane.{uuid.uuid4()}@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 201)

    def test_get_all_places(self):
        response = self.client.get('/api/v1/places/')
        self.assertEqual(response.status_code, 200)

    def test_get_place_not_found(self):
        response = self.client.get('/api/v1/places/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestReviewEndpoints(TestBase):

    def setUp(self):
        super().setUp()
        self.user_id, self.user_headers = self.create_regular_user()

        place_response = self.client.post('/api/v1/places/', json={
            'title': 'Place to Review',
            'description': 'A place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'amenities': []
        }, headers=self.user_headers)
        self.place_id = place_response.get_json()['id']

        # Create a second user to write reviews
        self.reviewer_id, self.reviewer_headers = self.create_regular_user()

    def test_create_review(self):
        response = self.client.post('/api/v1/reviews/', json={
            'text': 'Great place!',
            'rating': 5,
            'place_id': self.place_id
        }, headers=self.reviewer_headers)
        self.assertEqual(response.status_code, 201)

    def test_create_review_invalid_rating(self):
        response = self.client.post('/api/v1/reviews/', json={
            'text': 'Bad rating',
            'rating': 10,
            'place_id': self.place_id
        }, headers=self.reviewer_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_review_own_place(self):
        response = self.client.post('/api/v1/reviews/', json={
            'text': 'My own place',
            'rating': 5,
            'place_id': self.place_id
        }, headers=self.user_headers)
        self.assertEqual(response.status_code, 400)

    def test_create_review_no_token(self):
        response = self.client.post('/api/v1/reviews/', json={
            'text': 'No auth',
            'rating': 5,
            'place_id': self.place_id
        })
        self.assertEqual(response.status_code, 401)

    def test_get_review_not_found(self):
        response = self.client.get('/api/v1/reviews/non-existent-id')
        self.assertEqual(response.status_code, 404)

    def test_delete_review_not_found(self):
        response = self.client.delete('/api/v1/reviews/non-existent-id',
                                    headers=self.reviewer_headers)
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()