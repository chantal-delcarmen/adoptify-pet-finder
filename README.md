🐾 Adoptify: Pet Finder

Welcome to the Adoptify project! This guide will walk you through setting up and running the app locally using Docker.

📋 Project Overview

Adoptify is a full-stack application built to help users discover adoptable pets across different shelters. It includes:

Backend: Django + MySQL

Frontend: React.js

Database: MySQL (Dockerized)

Container Management: Docker + Docker Compose

📁 Folder Structure

adoptify-pet-finder/
├── backend/                 # Django backend
│   ├── adoptify_backend/   # Django settings and URLs
│   ├── api/                # API views
│   ├── .env                # Backend env variables
│   ├── manage.py
│   └── wait_for_db.py
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   ├── .env.development
│   └── Dockerfile
├── docker-compose.yml      # Defines all services
├── README.md
└── .gitignore

🚀 Local Setup Guide

✅ Prerequisites

📦 Docker Desktop

🧰 Git

📝 (Optional) VS Code

🛠️ Getting Started

1. Clone the repository

git clone https://github.com/chantal-delcarmen/adoptify-pet-finder.git
cd adoptify-pet-finder

2. Build and run the project

docker-compose down               # (Optional) Stops any running containers
docker-compose build --no-cache  # Rebuild everything cleanly
docker-compose up                # Start all services

3. Open the application

🌐 Frontend: http://localhost:3000

🔌 Backend Test API: http://localhost:8000/api/test/

You should see a response:

{"message": "Backend is working!"}

🧯 Troubleshooting & Fixes

🚫 Error reaching backend

Ensure your frontend/.env.development contains:

REACT_APP_API_URL=http://localhost:8000/api/

Then rebuild the frontend:

docker-compose build frontend

🔐 CORS errors

Ensure the backend has the following:

django-cors-headers installed (listed in requirements.txt)

settings.py includes:

INSTALLED_APPS += ["corsheaders"]
MIDDLEWARE = [
  "corsheaders.middleware.CorsMiddleware",
  "django.middleware.common.CommonMiddleware",
  ...
]

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

🔄 Frontend changes not showing?

Rebuild the frontend container:

docker-compose build frontend

🏷️ Git Tag Reference

v0.1.0-local-complete — Full local setup: frontend, backend, and DB running through Docker Compose.

🙋‍♀️ Need Help?

If you're stuck, unsure about setup steps, or just want to confirm things are working — feel free to ask or open an issue in the repo.

Happy coding, and welcome to Adoptify! 🐶🐱