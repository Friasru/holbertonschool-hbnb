#!/usr/bin/env python3
"""
Setup test data for HBNB application
"""
from app import create_app
from app.extensions import db
from app.services import facade

def setup_test_data():
    """Create sample data for testing"""
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        print("✓ Database tables created")
        
        # Create a test user
        try:
            user = facade.create_user({
                'first_name': 'John',
                'last_name': 'Doe',
                'email': 'john@example.com',
                'password': 'password123',
                'is_admin': False
            })
            print(f"✓ Test user created: {user.email}")
        except Exception as e:
            print(f"⚠ User creation error: {e}")
        
        # Create amenities
        amenities_data = [
            {'name': 'WiFi'},
            {'name': 'Air Conditioning'},
            {'name': 'Kitchen'},
            {'name': 'Parking'},
            {'name': 'Pool'},
            {'name': 'Gym'}
        ]
        
        amenities = []
        for amenity_data in amenities_data:
            try:
                amenity = facade.create_amenity(amenity_data)
                amenities.append(amenity)
                print(f"✓ Amenity created: {amenity.name}")
            except Exception as e:
                print(f"⚠ Amenity creation error: {e}")
        
        # Create test places
        if len(amenities) >= 2:
            places_data = [
                {
                    'title': 'Cozy Apartment Downtown',
                    'description': 'A comfortable and well-furnished apartment in the heart of the city.',
                    'price': 99.99,
                    'latitude': 40.7128,
                    'longitude': -74.0060,
                    'owner_id': user.id,
                    'amenities': [amenities[0].id, amenities[1].id]
                },
                {
                    'title': 'Modern Studio with View',
                    'description': 'Stylish studio with amazing city views and modern amenities.',
                    'price': 85.50,
                    'latitude': 40.7580,
                    'longitude': -73.9855,
                    'owner_id': user.id,
                    'amenities': [amenities[0].id, amenities[2].id]
                },
                {
                    'title': 'Spacious Family House',
                    'description': 'Large family home with garden and multiple bedrooms.',
                    'price': 150.00,
                    'latitude': 40.7489,
                    'longitude': -73.9680,
                    'owner_id': user.id,
                    'amenities': [amenities[0].id, amenities[3].id, amenities[4].id]
                },
                {
                    'title': 'Luxury Penthouse',
                    'description': 'Stunning penthouse with pool access and premium amenities.',
                    'price': 250.00,
                    'latitude': 40.7614,
                    'longitude': -73.9776,
                    'owner_id': user.id,
                    'amenities': [amenities[0].id, amenities[1].id, amenities[4].id, amenities[5].id]
                }
            ]
            
            for place_data in places_data:
                try:
                    place = facade.create_place(place_data)
                    print(f"✓ Place created: {place.title} (${place.price})")
                except Exception as e:
                    print(f"⚠ Place creation error: {e}")
        
        print("\n✓ Test data setup complete!")
        print("\nTest Credentials:")
        print("  Email: admin@hbnb.io")
        print("  Password: admin1234")
        print("\nAlternative Test Credentials:")
        print("  Email: john@example.com")
        print("  Password: password123")

if __name__ == '__main__':
    setup_test_data()