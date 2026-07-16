-- Insert admin user (password is 'admin1234' hashed with bcrypt)
INSERT INTO users (id, first_name, last_name, email, password, is_admin)
VALUES (
    '36c9050e-ddd3-4c3b-9731-9f487208bbc1',
    'Admin',
    'User',
    'admin@hbnb.io',
    '$2b$12$haYmJbMvRCRaF1bOkFXEuOA0a5t0qSXOl/r/DFGkDkaBcWg4XCMKS',
    TRUE
);

-- Insert initial amenities
INSERT INTO amenities (id, name)
VALUES
    ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'WiFi'),
    ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Swimming Pool'),
    ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Air Conditioning'),
    ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Parking'),
    ('e5f6a7b8-c9d0-1234-efab-345678901234', 'Pet Friendly');