import time
import MySQLdb
from django.db import OperationalError

db_settings = {
    "host": "db",
    "port": 3306,
    "user": "adoptify_user",
    "passwd": "adoptify_pw",
    "db": "adoptify"
}

while True:
    try:
        conn = MySQLdb.connect(**db_settings)
        conn.close()
        print("✅ Database is ready!")
        break
    except OperationalError:
        print("⏳ Waiting for database to be ready...")
        time.sleep(1)
