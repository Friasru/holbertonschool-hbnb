import unittest
import uuid
from app import create_app


class TestUserEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_user(self):
        response = self.client.post('/api/v1/users/', json={
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@example.com"
        })
        self.assertEqual(response.status_code, 201)

    def test_create_user_invalid_data(self):
        response = self.client.post('/api/v1/users/', json={
            "first_name": "",
            "last_name": "",
            "email": "invalid-email"
        })
        self.assertEqual(response.status_code, 400)

    def test_get_all_users(self):
        response = self.client.get('/api/v1/users/')
        self.assertEqual(response.status_code, 200)

    def test_get_user_not_found(self):
        response = self.client.get('/api/v1/users/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestAmenityEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_create_amenity(self):
        response = self.client.post('/api/v1/amenities/', json={
            "name": "Wi-Fi"
        })
        self.assertEqual(response.status_code, 201)

    def test_create_amenity_invalid_data(self):
        response = self.client.post('/api/v1/amenities/', json={
            "name": ""
        })
        self.assertEqual(response.status_code, 400)

    def test_get_all_amenities(self):
        response = self.client.get('/api/v1/amenities/')
        self.assertEqual(response.status_code, 200)

    def test_get_amenity_not_found(self):
        response = self.client.get('/api/v1/amenities/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestPlaceEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

        # create a user to use as owner
        user_response = self.client.post('/api/v1/users/', json={
            "first_name": "Owner",
            "last_name": "Test",
            "email": f"owner.test.{uuid.uuid4()}@example.com"
        })
        self.owner_id = user_response.get_json()['id']

    def test_create_place(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "Cozy Apartment",
            "description": "A nice place",
            "price": 100.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": self.owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 201)

    def test_create_place_invalid_price(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "Bad Place",
            "description": "Invalid price",
            "price": -50.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": self.owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_create_place_invalid_latitude(self):
        response = self.client.post('/api/v1/places/', json={
            "title": "Bad Place",
            "description": "Invalid latitude",
            "price": 100.0,
            "latitude": 200.0,
            "longitude": -122.4194,
            "owner_id": self.owner_id,
            "amenities": []
        })
        self.assertEqual(response.status_code, 400)

    def test_get_all_places(self):
        response = self.client.get('/api/v1/places/')
        self.assertEqual(response.status_code, 200)

    def test_get_place_not_found(self):
        response = self.client.get('/api/v1/places/non-existent-id')
        self.assertEqual(response.status_code, 404)


class TestReviewEndpoints(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

        # create a user
        user_response = self.client.post('/api/v1/users/', json={
            "first_name": "Reviewer",
            "last_name": "Test",
            "email": f"reviewer.test.{uuid.uuid4()}@example.com"
        })
        self.user_id = user_response.get_json()['id']

        # create a place
        place_response = self.client.post('/api/v1/places/', json={
            "title": "Place to Review",
            "description": "A place",
            "price": 100.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": self.user_id,
            "amenities": []
        })
        self.place_id = place_response.get_json()['id']

    def test_create_review(self):
        response = self.client.post('/api/v1/reviews/', json={
            "text": "Great place!",
            "rating": 5,
            "user_id": self.user_id,
            "place_id": self.place_id
        })
        self.assertEqual(response.status_code, 201)

    def test_create_review_invalid_rating(self):
        response = self.client.post('/api/v1/reviews/', json={
            "text": "Bad rating",
            "rating": 10,
            "user_id": self.user_id,
            "place_id": self.place_id
        })
        self.assertEqual(response.status_code, 400)

    def test_get_review_not_found(self):
        response = self.client.get('/api/v1/reviews/non-existent-id')
        self.assertEqual(response.status_code, 404)

    def test_delete_review_not_found(self):
        response = self.client.delete('/api/v1/reviews/non-existent-id')
        self.assertEqual(response.status_code, 404)


if __name__ == '__main__':
    unittest.main()
