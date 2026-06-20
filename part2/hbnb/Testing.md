# HBnB API - Testing Report

# Testing

I tested the API using cURL, the Swagger UI, and unit tests with unittest.

## Validation

If something is invalid, the API returns 400.

## API Documentation 

Docs available at http://127.0.0.1:5000/api/v1/. All 4 namespaces show up correctly.

## Unit tests

- python3 -m unittest test_app.py -v

All 17 passed.

## Bug found

Invalid data was returning because of validation errors. Fixed by adding try/except in the endpoints.
