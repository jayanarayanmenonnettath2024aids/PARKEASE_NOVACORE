import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def test_smtp():
    sender_email = os.environ.get('EMAIL_USER')
    sender_password = os.environ.get('EMAIL_PASS')
    
    if not sender_email or not sender_password:
        print("Missing credentials in .env")
        return
        
    print(f"Testing SMTP with user: {sender_email}")
    
    try:
        msg = MIMEMultipart()
        msg['From'] = f"ParkEase Core <{sender_email}>"
        msg['To'] = sender_email # Send to self
        msg['Subject'] = "ParkEase System Diagnostics"
        
        msg.attach(MIMEText("This is a test from the diagnostic system.", 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(1) # See the actual SMTP transaction
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print("\nSUCCESS: Email delivered!")
    except Exception as e:
        print(f"\nFAILURE: {e}")

if __name__ == "__main__":
    test_smtp()
