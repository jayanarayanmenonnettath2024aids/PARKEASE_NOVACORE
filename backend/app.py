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

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()  # Auto-create tables for SQLite development
    app.run(debug=True, port=5000)
