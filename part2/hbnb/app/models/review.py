from app.extensions import db
from app.models.base_model import BaseModel

class Review(BaseModel):
    __tablename__ = 'reviews'

    text = db.Column(db.String(1000), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    # Relationships
    place_id = db.Column(db.String(36), db.ForeignKey('places.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('reviews', lazy=True))

    def __init__(self, text, rating, place, user):
        super().__init__()
        if not text:
            raise ValueError("Review text is required")
        if not isinstance(rating, int) or not (1 <= rating <= 5):
            raise ValueError("Rating must be an integer between 1 and 5")
        if place is None:
            raise ValueError("Place is required")
        if user is None:
            raise ValueError("User is required")
        self.text = text
        self.rating = rating
        self.place = place
        self.place_id = place.id
        self.user = user
        self.user_id = user.id