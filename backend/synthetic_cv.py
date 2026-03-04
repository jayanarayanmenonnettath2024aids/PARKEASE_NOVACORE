import time
import random
import requests
import threading

# The local flask server endpoint
BASE_URL = "http://127.0.0.1:5000/api/parking/lots"
API_KEY = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"

last_vacant_state = {}

def fetch_lots():
    try:
        resp = requests.get(BASE_URL)
        if resp.status_code == 200:
            return resp.json()
    except Exception as e:
        print("Backend not reachable...", e)
    return []

def simulate_cv_for_lot(lot):
    lot_id = lot["id"]
    
    # Lot 1 is controlled by the REAL Computer Vision module (main.py)
    if lot_id == 1:
        return
        
    total = lot["total_slots"]
    
    # Initialize the state if not present (start semi-full)
    if lot_id not in last_vacant_state:
        last_vacant_state[lot_id] = random.randint(int(total * 0.3), int(total * 0.8))
        
    curr_vacant = last_vacant_state[lot_id]
    
    # Realistic change: +/- a few cars every cycle
    change = random.randint(-3, 2) # Slight bias to fill up
    new_vacant = curr_vacant + change
    
    # Never exceed total or go below 0
    vacant = max(0, min(total, new_vacant))
    last_vacant_state[lot_id] = vacant

    try:
        url = f"{BASE_URL}/{lot_id}/vacant"
        headers = {
            "Content-Type": "application/json",
            "X-API-Key": API_KEY
        }
        resp = requests.put(url, json={"vacant_count": vacant}, headers=headers)
        print(f"[CV Simulator Node] Lot {lot_id} ('{lot['name']}'): Synth Vacant -> {vacant}/{total} slots. HTTP {resp.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"[CV Simulator Node] Sync Failed for {lot_id}: {e}")

def run_synthetic_cv_pipeline():
    print("------------------------------------------------------------------")
    print("🚀 ParkEase Synthetic Computer Vision Model Activating...")
    print("This pipeline will push occupancy state vectors to the Flask API.")
    print("------------------------------------------------------------------")
    
    while True:
        lots = fetch_lots()
        if lots:
            print("--- New Frame Cycle ---")
            for lot in lots:
                # Fire CV update asynchronously to prevent blocking
                threading.Thread(target=simulate_cv_for_lot, args=(lot,)).start()
        else:
            print("Awaiting API connection...")
            
        time.sleep(8)  # Fire every 8 seconds

if __name__ == "__main__":
    run_synthetic_cv_pipeline()
