#!/usr/bin/env python3
import os
from app import create_app
from app.extensions import db

app = create_app()

with app.app_context():
    # Drop all tables
    db.drop_all()
    print("✓ Dropped all tables")
    
    # Create all tables
    db.create_all()
    print("✓ Created all tables")
    
    # Check if users table exists
    result = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
    if result.fetchone():
        print("✓ Users table exists")
    else:
        print("❌ Users table not created")
