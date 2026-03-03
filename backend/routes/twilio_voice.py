import os
from flask import Blueprint, request, jsonify
from twilio.twiml.voice_response import VoiceResponse, Gather
from twilio.rest import Client
from models import db, ParkingLot, ParkingSlot, User, Booking
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)
twilio_bp = Blueprint('twilio', __name__)

account_sid = os.environ.get('TWILIO_ACCOUNT_SID', 'mock_sid')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN', 'mock_token')
twilio_number = os.environ.get('TWILIO_PHONE_NUMBER', '+1234567890')

client = None
if account_sid != 'mock_sid' and auth_token != 'mock_token':
    try:
        client = Client(account_sid, auth_token)
    except Exception as e:
        logger.error(f"Failed to initialize Twilio Client: {str(e)}")

@twilio_bp.route('/incoming', methods=['POST', 'GET'])
def incoming_call():
    """Handle incoming calls and present IVR options."""
    resp = VoiceResponse()
    
    gather = Gather(num_digits=1, action='/api/twilio/gather', method='POST')
    gather.say("Welcome to Park Ease.", voice='Polly.Joanna')
    gather.say("To check parking availability, press 1.", voice='Polly.Joanna')
    gather.say("To book a parking slot, press 2.", voice='Polly.Joanna')
    resp.append(gather)
    
    # If the user doesn't select an option, redirect them into the loop
    resp.redirect('/api/twilio/incoming')
    return str(resp)

@twilio_bp.route('/gather', methods=['POST'])
def gather_input():
    digit = request.values.get('Digits', None)
    caller_phone = request.values.get('From', "Unknown")
    
    resp = VoiceResponse()
    
    if digit == '1':
        # Check availability
        lot = ParkingLot.query.first() # Simplification: taking the first lot
        if lot:
            available = ParkingSlot.query.filter_by(lot_id=lot.id, status='available').count()
            resp.say(f"There are currently {available} slots available at {lot.name}.", voice='Polly.Joanna')
        else:
            resp.say("Sorry, no parking lots are currently configured in the system.", voice='Polly.Joanna')
            
    elif digit == '2':
        # Book slot
        lot = ParkingLot.query.first()
        available_slot = ParkingSlot.query.filter_by(lot_id=lot.id, status='available').first() if lot else None
        
        if lot and available_slot:
            # Check if user exists or create a guest user
            user = User.query.filter_by(phone=caller_phone).first()
            if not user:
                from passlib.hash import bcrypt
                hashed_pw = bcrypt.hash("guest123")
                user = User(name='Phone Guest', phone=caller_phone, password=hashed_pw)
                db.session.add(user)
                db.session.commit()
                
            available_slot.status = 'reserved'
            booking = Booking(
                user_id=user.id,
                slot_id=available_slot.id,
                expiry_time=datetime.utcnow() + timedelta(minutes=15),
                token_amount=50.0
            )
            db.session.add(booking)
            db.session.commit()
            
            resp.say("Your slot has been reserved for 15 minutes. We have sent an SMS with the payment link to confirm.", voice='Polly.Joanna')
            
            # Send SMS with payment link
            if client:
                try:
                    payment_link = f"https://parkease.test/pay/{booking.id}"
                    client.messages.create(
                        body=f"ParkEase: Pay your token here to confirm booking: {payment_link}",
                        from_=twilio_number,
                        to=caller_phone
                    )
                    logger.info(f"SMS SENT to {caller_phone} for booking {booking.id}")
                except Exception as e:
                    logger.error(f"Twilio SMS Error: {e}")
            else:
                logger.info(f"[MOCK] SMS would be sent to {caller_phone} for booking {booking.id}")
                
        else:
            resp.say("Sorry, there are no slots available right now.", voice='Polly.Joanna')
            
    else:
        resp.say("Invalid choice. Goodbye.", voice='Polly.Joanna')
        
    return str(resp)
