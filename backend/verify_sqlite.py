import sqlite3

def verify_sqlite():
    try:
        conn = sqlite3.connect('parkease.db')
        cur = conn.cursor()
        
        print("--- SQLITE RECENT USERS ---")
        cur.execute("SELECT id, name, email FROM user ORDER BY id DESC LIMIT 5;")
        for row in cur.fetchall():
            print(row)
            
        print("--- SQLITE RECENT BOOKINGS ---")
        cur.execute("SELECT id, user_id, booking_time FROM booking ORDER BY id DESC LIMIT 5;")
        for row in cur.fetchall():
            print(row)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"No sqlite tables: {e}")

if __name__ == "__main__":
    verify_sqlite()
