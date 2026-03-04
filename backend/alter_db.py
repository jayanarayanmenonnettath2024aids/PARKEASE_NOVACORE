import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.getenv('DATABASE_URL')

print(f"Connecting to {db_url}")

try:
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    cursor.execute("ALTER TABLE booking ADD COLUMN vehicle_number VARCHAR(20)")
    conn.commit()
    print("Successfully added vehicle_number column!")
except Exception as e:
    print(f"Database error: {e}")
finally:
    if 'conn' in locals():
        conn.close()
