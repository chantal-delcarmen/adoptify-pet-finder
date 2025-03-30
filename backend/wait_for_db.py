import time
import MySQLdb
import os

db_settings = {
    "host": os.environ.get("DB_HOST", "db"),
    "user": os.environ.get("DB_USER", "adoptify_user"),
    "passwd": os.environ.get("DB_PASSWORD", "yourpassword"),
    "db": os.environ.get("DB_NAME", "adoptify"),
}

while True:
    try:
        conn = MySQLdb.connect(**db_settings)
        print("✅ Database is ready!")
        break
    except MySQLdb.OperationalError as e:
        print("⏳ Waiting for database...", str(e))
        time.sleep(2)
