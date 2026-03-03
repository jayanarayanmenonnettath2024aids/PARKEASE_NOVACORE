import os
import traceback
from app import app, db
from models import ParkingLot

try:
    with app.app_context():
        # First check if table exists
        lots = ParkingLot.query.all()
        print("Successfully queried the database!")
        print(f"Number of lots: {len(lots)}")
        if not lots:
            print("The ParkingLot table is empty. Mock data is missing.")
except Exception as e:
    print("Error connecting to the database or querying ParkingLot:")
    traceback.print_exc()
