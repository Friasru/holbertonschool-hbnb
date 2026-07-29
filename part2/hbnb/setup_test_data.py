#!/usr/bin/env python3
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review
from app.services import facade

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()
    print("✓ Database tables created")
    
    # Create user
    user = facade.create_user({
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'password': 'password123'
    })
    print(f"✓ User created: {user.email}")
    
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
    for data in amenities_data:
        amenity = facade.create_amenity(data)
        amenities.append(amenity)
        print(f"✓ Amenity: {amenity.name}")
    
    # Create places
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
    
    for data in places_data:
        place = facade.create_place(data)
        print(f"✓ Place: {place.title} (${place.price})")
    
    print("\n✓ All data created successfully!")
    print("\nLogin with:")
    print("  Email: john@example.com")
    print("  Password: password123")