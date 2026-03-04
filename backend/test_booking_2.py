import requests
from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token
from app import create_app

BASE_URL = "http://127.0.0.1:5000/api"

def generate_token():
    app = create_app()
    with app.app_context():
        # Generate token for user_id 2 (JAYANTHI)
        return create_access_token(identity="2")

def test_booking_jayanthi():
    token = generate_token()
    print("Spoofing JWT for User ID #2 (JAYANTHI)...")
    
    lots_resp = requests.get(f"{BASE_URL}/parking/lots")
    if lots_resp.status_code != 200:
        print("Failed to fetch lots.", lots_resp.text)
        return
        
    lots = lots_resp.json()
    if not lots:
        print("No parking lots found.")
        return
        
    lot_id = lots[0]["id"]
    slots_resp = requests.get(f"{BASE_URL}/parking/lots/{lot_id}/slots")
    slots_data = slots_resp.json().get("slots", [])
    
    available_slot = next((s for s in slots_data if s["status"] == "available"), None)
    if not available_slot:
        print("No available slots found.")
        return
        
    print(f"Attempting Backend Request to reserve Slot {available_slot['slot_number']} (ID: {available_slot['id']})...")
    
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "slot_id": available_slot["id"],
        "vehicle_number": "JAY 999"
    }
    
    reserve_resp = requests.post(f"{BASE_URL}/booking/reserve", json=payload, headers=headers)
    
    print(f"Response Code: {reserve_resp.status_code}")
    print(f"Response Body: {reserve_resp.text}")

if __name__ == "__main__":
    test_booking_jayanthi()
