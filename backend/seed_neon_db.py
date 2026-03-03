import sys
import os

# Ensure the backend directory is in the Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app
from models import db, ParkingLot, ParkingSlot

app = create_app()

MOCK_LOTS = [
    { "name": "Alpha Grand Hub", "location": "Peelamedu", "base_price": 40.0, "total_slots": 50, "lat": 11.0268, "lng": 76.9958 },
    { "name": "Skyline Plaza", "location": "RS Puram", "base_price": 60.0, "total_slots": 30, "lat": 11.0116, "lng": 76.9458 },
    { "name": "Metro Terminal", "location": "Gandhipuram", "base_price": 35.0, "total_slots": 100, "lat": 11.0232, "lng": 76.9658 },
    { "name": "Elite Square", "location": "Race Course", "base_price": 80.0, "total_slots": 20, "lat": 11.0068, "lng": 76.9658 },
    { "name": "Central Station Park", "location": "Central", "base_price": 30.0, "total_slots": 50, "lat": 11.0003, "lng": 76.9637 }
]

with app.app_context():
    print("Creating tables in Neon Postgres...")
    db.create_all()
    print("Tables created successfully.")
    
    if ParkingLot.query.count() == 0:
        print("Seeding Parking Lots...")
        for lot_data in MOCK_LOTS:
            lot = ParkingLot(
                name=lot_data["name"],
                location=lot_data["location"],
                latitude=lot_data["lat"],
                longitude=lot_data["lng"],
                base_price=lot_data["base_price"],
                total_slots=lot_data["total_slots"]
            )
            db.session.add(lot)
            db.session.flush() # flush to get lot.id
            
            # Create a few available slots
            print(f"Adding slots for {lot.name}...")
            # Mocking only a subset of slots just to have some available
            for i in range(1, 15): 
                slot = ParkingSlot(
                    lot_id=lot.id,
                    slot_number=f"A{i}",
                    status="available"
                )
                db.session.add(slot)
                
        db.session.commit()
        print("Database seeding complete!")
    else:
        print("Database already contains Data. Skipping seed.")
