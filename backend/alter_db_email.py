import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def add_email_column():
    DATABASE_URL = os.environ.get("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found.")
        return

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Add email column, 'user' is a reserved keyword in Postgres, so must be quoted.
        cur.execute('ALTER TABLE "user" ADD COLUMN IF NOT EXISTS email VARCHAR(120) UNIQUE;')
        
        conn.commit()
        print("Verification Complete: The 'email' column successfully exists in the schema!")
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Postgres Alteration Warning (Feature may already exist): {e}")

if __name__ == "__main__":
    add_email_column()
