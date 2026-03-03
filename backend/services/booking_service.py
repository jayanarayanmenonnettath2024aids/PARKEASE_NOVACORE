import logging
from models import db, Booking, ParkingSlot
from datetime import datetime

logger = logging.getLogger(__name__)

def auto_cancel_expired_bookings():
    """
    Find bookings that are 'pending' and past their expiry_time.
    Cancel them and free up the associated parking slot.
    """
    try:
        now = datetime.utcnow()
        expired_bookings = Booking.query.filter(
            Booking.status == 'pending',
            Booking.expiry_time < now
        ).all()
        
        if not expired_bookings:
            return
            
        for booking in expired_bookings:
            booking.status = 'cancelled'
            logger.info(f"Auto-cancelling booking ID: {booking.id}")
            
            # Free up the slot if it was reserved by this booking
            slot = ParkingSlot.query.get(booking.slot_id)
            if slot and slot.status == 'reserved':
                slot.status = 'available'
                
        db.session.commit()
        logger.info(f"Auto-cancelled {len(expired_bookings)} expired bookings.")
    except Exception as e:
        logger.error(f"Error in auto_cancel_expired_bookings: {str(e)}")
        db.session.rollback()
