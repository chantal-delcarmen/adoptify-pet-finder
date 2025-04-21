# Adoptify Pet Finder

Adoptify Pet Finder is a web application designed to connect pet shelters with potential adopters. It allows users to browse available pets, submit adoption applications, and manage their favorite pets.

## Features
- User registration and authentication
- Pet browsing and filtering
- Adoption application submission
- Favorites management
- Admin panel for shelter management

## Installation

### Prerequisites
- Python 3.10+
- Docker and Docker Compose (optional for containerized setup)
- Node.js (if applicable for the frontend)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/adoptify-pet-finder.git
   cd adoptify-pet-finder

2. Backend Setup:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up environment variables:
     - Rename `env.development` to `.env.development`:
       ```bash
       mv env.development .env.development
       ```
     - Ensure the `.env.development` file contains the correct values.
   - Apply database migrations:
     ```bash
     python manage.py migrate
     ```
   - Run the development server:
     ```bash
     python manage.py runserver
     ```

3. Frontend Setup (if applicable):
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```

4. Docker Setup (optional):
   - Navigate to the project root directory (where `docker-compose.yml` is located).
   - Build and run the containers:
     ```bash
     docker-compose up --build
     ```

5. Access the application:
   - Backend: `http://localhost:8000`
   - Frontend: `http://localhost:3000` (if applicable)

## API Endpoints

### Authentication
- **Login**: `POST /api/token/`
- **Refresh Token**: `POST /api/token/refresh/`

### Pets
- **List Pets**: `GET /api/pets/`
- **Pet Details**: `GET /api/pets/<id>/`

### Favorites
- **Add to Favorites**: `POST /api/favourites/add/<pet_id>/`
- **List Favorites**: `GET /api/favourites/`
- **Remove from Favorites**: `DELETE /api/favourites/remove/<pet_id>/`

### Adoption Applications
- **Submit Application**: `POST /api/adoption-application/`
- **List Applications**: `GET /api/adoption-application/list/`

## Project Structure

```
adoptify-pet-finder/
├── backend/
│   ├── adoptify_backend/
│   │   ├── settings.py       # Django settings
│   │   ├── urls.py           # Project-level URLs
│   │   ├── wsgi.py           # WSGI entry point
│   │   └── .env.development  # Environment variables
│   ├── api/
│   │   ├── models.py         # Database models
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # API views
│   │   └── urls.py           # App-level URLs
│   └── manage.py             # Django management script
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

## Contribution Guide

We welcome contributions! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Create a pull request.


