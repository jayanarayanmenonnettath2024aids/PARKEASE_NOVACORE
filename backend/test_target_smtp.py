import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

def test_specific_smtp():
    sender_email = os.environ.get('EMAIL_USER')
    sender_password = os.environ.get('EMAIL_PASS')
    
    target_email = "ejayanth2006@gmail.com"
    
    print(f"Testing SMTP from {sender_email} to {target_email}...")
    
    try:
        msg = MIMEMultipart()
        msg['From'] = f"ParkEase Core <{sender_email}>"
        msg['To'] = target_email
        msg['Subject'] = "ParkEase Custom Delivery Test"
        
        msg.attach(MIMEText("This is a direct diagnostic test for the jayanthi account.", 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.set_debuglevel(1)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print("\nSUCCESS: Target Email delivered!")
    except Exception as e:
        print(f"\nFAILURE: {e}")

if __name__ == "__main__":
    test_specific_smtp()
