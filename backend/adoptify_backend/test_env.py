from dotenv import load_dotenv
import os

# Path to the .env.development file
env_file_path = r"C:\Users\chant\OneDrive - University of Calgary\cpsc-471-dbms\adoptify-pet-finder\backend\adoptify_backend\.env.development"

# Load the .env file
load_dotenv(dotenv_path=env_file_path)

# Print values to verify
print(f"SECRET_KEY: {os.getenv('SECRET_KEY')}")
print(f"DEBUG: {os.getenv('DEBUG')}")
print(f"ALLOWED_HOSTS: {os.getenv('ALLOWED_HOSTS')}")