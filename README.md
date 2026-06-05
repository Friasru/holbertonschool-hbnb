# HBNB EVOLUTION - Holberton Coding School Technical Documentation
HBnB Evolution is a simplified AirBnB-like web application.

## Description
- Application supports:
    - User Management
    - Place Management
    - Review Management
    - Amenity Management

# Structure

## 0. High-Level Architecture

The app is divided into 3 layers

- Presentation layer recieves requests from the user though the API

- Business Logic layer processes and validates data

- Persistence layer saves and retrieves data from the database

The layers communicate through the Facade Pattern meaning each layer only talks to the one directly below it.

## 1. Business Logic Layer

This layer has 4 main classes

- User - can register, update profile and be an admin

- Place - property listed by a user with title, price and location

- Review - rating and comment left by a user for a place

- Amenity - feature a place can offer, like a pool

## 2. API Interacion Flow

The 4 diagrams show what happens step by step when a user does something in the app. Every time it follows the same pattern.

- User registration - user signs up and gets saved into the database

- Place creation - user creates a new property listing and gets saved into the database

- Review submission - user leaves a review for a place and the app checks if the place exist before saving it into the database

- Fetching places - user requests a list of places and the data base returns a list of the places the user requested


##### Authors
- Alberto Frias Ruiz - Cohort 29