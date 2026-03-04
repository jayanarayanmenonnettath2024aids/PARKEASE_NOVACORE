import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import random
import string

def send_email(to_email, subject, body):
    sender_email = current_app.config.get('EMAIL_USER')
    sender_password = current_app.config.get('EMAIL_PASS')
    
    if not sender_email or not sender_password:
        print("Email credentials are not configured in environment variables.")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = f"ParkEase Core <{sender_email}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

def generate_temp_password(length=8):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))
