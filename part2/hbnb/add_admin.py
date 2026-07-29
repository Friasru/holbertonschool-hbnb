from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
from app.models.review import Review
from app.services import facade

app = create_app()

with app.app_context():
    admin = facade.create_user({
        'first_name': 'Admin',
        'last_name': 'User',
        'email': 'admin@hbnb.io',
        'password': 'admin1234',
        'is_admin': True
    })
    print(f"✓ Admin created: {admin.email}")
