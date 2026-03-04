import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def verify_data():
    DATABASE_URL = os.environ.get("DATABASE_URL")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("--- RECENT BOOKINGS ---")
        cur.execute("SELECT id, user_id, booking_time FROM booking ORDER BY id DESC LIMIT 5;")
        for row in cur.fetchall():
            print(row)
            
        print("--- RECENT USERS ---")
        cur.execute('SELECT id, name, phone, email FROM "user" ORDER BY id DESC LIMIT 5;')
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_data()
