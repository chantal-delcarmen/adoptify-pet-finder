# adoptify-pet-finder

adoptify-pet-finder/
├── backend/            # Django app (connects to DB)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── manage.py
│   ├── .env
│   └── adoptify_backend/
│       └── settings.py
│       └── ...
│
├── frontend/           # React app
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── ...
│
├── docker-compose.yml  # Defines MySQL as a container service
├── README.md
└── .gitignore

