import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def fix_users():
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found.")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute('SELECT id, name, phone, email FROM "user";')
        users = cur.fetchall()
        print("Existing Users:", users)
        
        cur.execute("UPDATE \"user\" SET email='novacore.projects2025@gmail.com' WHERE email IS NULL;")
        conn.commit()
        
        print("Null emails updated.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_users()
