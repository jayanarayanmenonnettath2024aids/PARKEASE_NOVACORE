from flask import Blueprint, request, jsonify
from models import db, ParkingLot, ParkingSlot
from services.pricing import calculate_dynamic_price

parking_bp = Blueprint('parking', __name__)

@parking_bp.route('/lots', methods=['GET'])
def get_parking_lots():
    lots = ParkingLot.query.all()
    results = []
    
    for lot in lots:
        total_slots = lot.total_slots
        available_slots = ParkingSlot.query.filter_by(lot_id=lot.id, status='available').count()
        
        # Calculate occupancy
        occupancy_percent = 0
        if total_slots > 0:
            occupancy_percent = ((total_slots - available_slots) / total_slots) * 100
            
        current_price = calculate_dynamic_price(
            base_price=lot.base_price, 
            time_of_day="now", 
            occupancy_percent=occupancy_percent, 
            event_flag=False
        )
        
        results.append({
            "id": lot.id,
            "name": lot.name,
            "location": lot.location,
            "base_price": lot.base_price,
            "current_price": round(current_price, 2),
            "total_slots": total_slots,
            "available_slots": available_slots,
            "is_surge": current_price > lot.base_price
        })
        
    return jsonify(results), 200

@parking_bp.route('/lots/<int:lot_id>/slots', methods=['GET'])
def get_parking_slots(lot_id):
    lot = ParkingLot.query.get_or_404(lot_id)
    slots = ParkingSlot.query.filter_by(lot_id=lot.id).all()
    
    results = [{
        "id": slot.id,
        "slot_number": slot.slot_number,
        "status": slot.status
    } for slot in slots]
    
    return jsonify({
        "lot_id": lot.id,
        "lot_name": lot.name,
        "slots": results
    }), 200

# Endpoint for Computer Vision module / API updates
@parking_bp.route('/slots/<int:slot_id>/status', methods=['PUT'])
def update_slot_status(slot_id):
    """
    Update slot status based on hardware / CV checks.
    Expected data: {"status": "available" | "occupied"}
    """
    data = request.json
    status = data.get('status')
    
    if status not in ['available', 'occupied']:
        return jsonify({"msg": "Invalid status"}), 400
        
    slot = ParkingSlot.query.get_or_404(slot_id)
    
    # Don't let CV free up a reserved slot automatically if someone hasn't parked yet
    # Or don't let it mark occupied if it's reserved (unless handling check-in logic)
    # Simple mock: just update it
    slot.status = status
    db.session.commit()
    
    return jsonify({"msg": "Slot updated successfully", "status": slot.status}), 200
