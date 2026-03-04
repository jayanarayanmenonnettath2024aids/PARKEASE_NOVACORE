import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from apscheduler.schedulers.background import BackgroundScheduler
import logging

# Set up simple logging
logging.basicConfig(level=logging.INFO)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    # Register Blueprints
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    
    from routes.parking import parking_bp
    app.register_blueprint(parking_bp, url_prefix='/api/parking')
    
    from routes.booking import booking_bp
    app.register_blueprint(booking_bp, url_prefix='/api/booking')
    
    from routes.twilio_voice import twilio_bp
    app.register_blueprint(twilio_bp, url_prefix='/api/twilio')
    
    from routes.oauth import oauth_bp
    app.register_blueprint(oauth_bp, url_prefix='/api/oauth')

    # Initialize APScheduler for booking timeout
    from services.booking_service import auto_cancel_expired_bookings
    scheduler = BackgroundScheduler()
    
    def run_auto_cancel():
        with app.app_context():
            auto_cancel_expired_bookings()
            
    scheduler.add_job(func=run_auto_cancel, trigger="interval", seconds=60)
    scheduler.start()

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy"}), 200

    @app.route('/api/test-email', methods=['GET'])
    def diagnostic_email_test():
        import os, smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        sender = os.environ.get('EMAIL_USER')
        pwd = os.environ.get('EMAIL_PASS')
        if not sender or not pwd:
            return jsonify({"status": "error", "reason": "Missing Env Vars"}), 500
            
        try:
            msg = MIMEMultipart()
            msg['From'] = f"ParkEase Core <{sender}>"
            msg['To'] = "ejayanth2006@gmail.com" # Directly target the user's known inbox
            msg['Subject'] = "Render Cloud SMTP Diagnostic"
            msg.attach(MIMEText("This is a direct, synchronous test from Render. If you receive this, the Cloud IP is not blocked and the credentials are valid in production.", 'html'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(sender, pwd)
            server.send_message(msg)
            server.quit()
            return jsonify({"status": "success", "msg": "Debug email sent natively from Render"}), 200
        except Exception as e:
            return jsonify({"status": "smtp_crash", "error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Auto-create tables for SQLite development
    app.run(debug=True, port=5000)
