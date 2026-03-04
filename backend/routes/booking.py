from flask import Blueprint, request, jsonify
from models import db, Booking, ParkingSlot, ParkingLot, Payment, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import uuid
from services.email_service import send_email
import threading

booking_bp = Blueprint('booking', __name__)

@booking_bp.route('/reserve', methods=['POST'])
@jwt_required()
def reserve_slot():
    """
    Reserve a parking slot for 15 minutes by paying a token amount.
    """
    user_id = get_jwt_identity()
    data = request.json
    slot_id = data.get('slot_id')
    vehicle_number = data.get('vehicle_number')
    
    if not slot_id:
        return jsonify({"msg": "Missing slot_id"}), 400
        
    slot = ParkingSlot.query.get_or_404(slot_id)
    if slot.status != 'available':
        return jsonify({"msg": "Slot is not available"}), 400
        
    # Lock the slot
    slot.status = 'reserved'
    
    # Token amount logic could be dynamic, hardcoded for now
    token_amount = 50.0 
    
    # Create booking expiring in 15 minutes
    expiry = datetime.utcnow() + timedelta(minutes=15)
    
    new_booking = Booking(
        user_id=user_id,
        slot_id=slot.id,
        expiry_time=expiry,
        status='pending',
        vehicle_number=vehicle_number,
        token_amount=token_amount
    )
    
    db.session.add(new_booking)
    db.session.flush() # To get new_booking.id
    
    # Mock token payment creation
    payment = Payment(
        booking_id=new_booking.id,
        transaction_id=str(uuid.uuid4()),
        amount=token_amount,
        status='completed'
    )
    db.session.add(payment)
    db.session.commit()
    
    user = User.query.get(user_id)
    if user and user.email:
        lot_name = slot.lot.name if slot.lot else "ParkEase Lot"
        subject = "ParkEase - Booking Confirmation"
        body = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #0ea5e9;">Booking Confirmed!</h2>
            <p>Dear <strong>{user.name}</strong>,</p>
            <p>Your parking slot <strong>{slot.slot_number}</strong> at <strong>{lot_name}</strong> has been successfully reserved.</p>
            <table style="width: 100%; max-width: 400px; margin-top: 15px; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Token Amount Paid:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">₹{token_amount}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Vehicle Number:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">{vehicle_number or 'N/A'}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Expiry Time:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">{expiry.strftime('%Y-%m-%d %H:%M:%S')} UTC</td></tr>
            </table>
            <p style="margin-top: 20px;">Please ensure you arrive before the expiration time. Token amount is non-refundable.</p>
            <p>- The ParkEase Auto-Agent</p>
            <p>- The ParkEase Auto-Agent</p>
        </div>
        """
        threading.Thread(target=send_email, args=(user.email, subject, body), daemon=True).start()
    
    return jsonify({
        "msg": "Slot reserved successfully",
        "booking_id": new_booking.id,
        "expiry_time": expiry.isoformat(),
        "token_amount": token_amount,
        "slot_number": slot.slot_number
    }), 201

@booking_bp.route('/my_bookings', methods=['GET'])
@jwt_required()
def get_my_bookings():
    user_id = get_jwt_identity()
    bookings = Booking.query.filter_by(user_id=user_id).order_by(Booking.booking_time.desc()).all()
    
    results = []
    for b in bookings:
        slot = ParkingSlot.query.get(b.slot_id)
        lot = ParkingLot.query.get(slot.lot_id) if slot else None
        
        results.append({
            "id": b.id,
            "lot_name": lot.name if lot else "Unknown",
            "slot_number": slot.slot_number if slot else "Unknown",
            "status": b.status,
            "booking_time": b.booking_time.isoformat(),
            "expiry_time": b.expiry_time.isoformat(),
            "token_amount": b.token_amount
        })
        
    return jsonify(results), 200

@booking_bp.route('/checkin/<int:booking_id>', methods=['POST'])
@jwt_required()
def confirm_checkin(booking_id):
    """
    Owner/CV confirms user arrived, transitioning reservation to active occupation.
    """
    user_id = get_jwt_identity()
    booking = Booking.query.filter_by(id=booking_id, user_id=user_id).first_or_404()
    
    if booking.status != 'pending':
        return jsonify({"msg": "Booking is not pending"}), 400
        
    booking.status = 'confirmed'
    slot = ParkingSlot.query.get(booking.slot_id)
    if slot:
        slot.status = 'occupied'
        
    db.session.commit()
    
    return jsonify({"msg": "Check-in successful"}), 200
