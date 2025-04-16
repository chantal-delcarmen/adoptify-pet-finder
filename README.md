# 🐾 Adoptify: Pet Finder

Welcome to the Adoptify project! This guide will walk you through setting up and running the app locally using Docker.

> **Disclaimer**: This README was generated with the assistance of Generative AI (GenAI). Please verify the information and adapt it as needed.

---

## 📋 Project Overview

Adoptify is a full-stack application built to help users discover adoptable pets across different shelters. It includes:

- **Backend**: Django + MySQL
- **Frontend**: React.js
- **Database**: MySQL (Dockerized)
- **Container Management**: Docker + Docker Compose

---

## 📁 Folder Structure

```
adoptify-pet-finder/
├── backend/                    # Django backend
│   ├── adoptify_backend/       # Django settings and configuration
│   │   ├── settings.py         # Backend configuration (connects to MySQL)
│   │   ├── .env.example        # Example environment variables for backend
│   │   ├── .env.development
│   │   ├── .env.production
│   ├── api/                    # API views and models
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   ├── manage.py               # Django management script
│   ├── requirements.txt        # Backend dependencies
│   └── wait_for_db.py          # Script to wait for MySQL to be ready
├── frontend/                   # React frontend
│   ├── src/                    # Frontend source code
│   ├── .env.example            # Example environment variables for frontend
│   ├── .env.development
│   ├── .env.production
│   ├── package.json            # Frontend dependencies
│   └── Dockerfile              # Frontend Docker configuration
├── docker-compose.yml          # Defines all services (backend, frontend, MySQL)
├── docker-compose.override.yml # Local development overrides
├── docker-compose.prod.yml     # Production configuration
├── README.md                   # Project documentation
└── .gitignore                  # Ignored files and directories
```

---

## 🚀 Local Setup Guide

### ✅ Prerequisites

Before starting, ensure you have the following installed and running:

- 📦 [Docker Desktop](https://www.docker.com/products/docker-desktop)  
  > **Note**: Make sure Docker Desktop is open and running before proceeding with the setup.
- 🧰 [GitHub](https://github.com/)  
  > **Note**: Ensure you have a GitHub account and access to the repository.
- 📝 (Optional) [VS Code](https://code.visualstudio.com/)

---

### 🛠️ Getting Started

1. Clone the repository

```bash
git clone https://github.com/chantal-delcarmen/adoptify-pet-finder.git
cd adoptify-pet-finder
```

2. Set Up Environment Variables
Backend:
```bash
cp backend/adoptify_backend/.env.example backend/adoptify_backend/.env.development
cp backend/adoptify_backend/.env.example backend/adoptify_backend/.env.production
```

Frontend:
```bash
cp frontend/.env.example frontend/.env.development
cp frontend/.env.example frontend/.env.production
```

- **.env.development**: Used for local development (e.g., `http://localhost:8000/api/`).
- **.env.production**: Used for production deployment (e.g., `http://backend:8000/api/`).

> **Note**: Ensure you update these files with the appropriate values for each environment.

3. Build and run the project

Before running the following commands, make sure **Docker Desktop** is installed and running on your machine.

Navigate to the root directory of the project (`adoptify-pet-finder/`) before running the following commands:

### 🛠️ First-Time Setup
If this is your first time setting up the project, run the following commands:

```bash
cd adoptify-pet-finder  # Ensure you're in the root directory

docker-compose down              # (Optional) Stops any running containers
docker-compose build --no-cache  # Rebuild everything cleanly
docker-compose up                # Start all services
```

### 🔄 Running the Project Next Time
If the project is already set up and no code changes were made, you can skip the build step and simply start the containers:

```bash
cd adoptify-pet-finder  # Ensure you're in the root directory

docker-compose up       # Start all services
```

To run the containers in detached mode (in the background), use:
```bash
docker-compose up -d
```

If you made changes to the code, rebuild the affected container(s) before starting:
```bash
docker-compose build frontend  # For frontend changes
docker-compose build backend   # For backend changes
docker-compose up
```

4. Open the application

- 🌐 Frontend: http://localhost:3000
- 🔌 Backend Test API: http://localhost:8000/api/test/

You should see a response:

```json
{"message": "Backend is working!"}
```

---

## 🛠️ Editing Files and Pushing Changes to Docker

1. For MySQL (Database Changes):
- If you need to modify the database schema:
  - (a) Update the models in models.py.
  - (b) Run migrations inside the backend container:
```bash
docker exec -it adoptify-pet-finder-backend-1 python manage.py makemigrations
docker exec -it adoptify-pet-finder-backend-1 python manage.py migrate
```

- (c) Verify the changes in the MySQL database:
```bash
 mysql -u adoptify_user -p
```

2. For Django Backend:
- If you make changes to the backend code:
  - (a) Edit the files in the backend directory.
  - (b) Rebuild the backend container:
```bash
docker-compose build backend
docker-compose up backend
```

3. For React Frontend:
- If you make changes to the frontend code:
  - (a) Edit the files in the src directory.
  - (b) Rebuild frontend container
```bash
docker-compose build frontend
docker-compose up frontend
  ```


## 🧯 Troubleshooting & Fixes

### 🚫 Error reaching backend

Ensure all the Docker containers are running:
```bash
docker ps
```
You should see containers named adoptify-pet-finder-db-1, adoptify-pet-finder-backend-1, and adoptify-pet-finder-frontend-1.

If any container is not running, restart the services:
```bash
docker-compose down
docker-compose up --build
```

### 🔐 CORS errors

Ensure the backend has the following:

- `django-cors-headers` installed (listed in `requirements.txt`)
- `settings.py` includes:

```python
INSTALLED_APPS += ["corsheaders"]
MIDDLEWARE = [
  "corsheaders.middleware.CorsMiddleware",
  "django.middleware.common.CommonMiddleware",
  ...
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
```

### 🔄 Frontend changes not showing?

Rebuild the frontend container:

```bash
docker-compose build frontend
```

---

## 🏷️ Git Tag Reference
- `v1.0.0` — Fully functional Docker-integrated setup with frontend, backend, and MySQL database.
- `v0.1.1` — Minor updates and bug fixes for local development.
- `v0.1.0-local-complete` — Full local setup: frontend, backend, and DB running through Docker Compose.
---

## 🙋‍♀️ Need Help?

If you're stuck, unsure about setup steps, or just want to confirm things are working — feel free to ask or open an issue in the repo.

Happy coding, and welcome to Adoptify! 🐶🐱

