# adoptify-pet-finder

```
adoptify-pet-finder/
├── backend/                       # Django backend
│   ├── .env
│   ├── .env.example
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   ├── wait_for_db.py
│   ├── adoptify_backend/
│   │   ├── __init__.py
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   └── api/
│       └── views.py
├── frontend/                      # React frontend
│   ├── .env
│   ├── .env.development
│   ├── .env.example
│   ├── .env.production
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── reportWebVitals.js
│       └── setupTests.js
├── docker-compose.yml
├── .gitignore
└── README.md
```
