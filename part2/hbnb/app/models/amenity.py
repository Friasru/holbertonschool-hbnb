from app.extensions import db
from app.models.base_model import BaseModel

class Amenity(BaseModel):
    __tablename__ = 'amenities'

    name = db.Column(db.String(50), nullable=False)

    def __init__(self, name):
        super().__init__()
        if not name or len(name) > 50:
            raise ValueError("Amenity name is required and must be under 50 characters")
        self.name = name