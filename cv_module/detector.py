import cv2
import numpy as np
import requests
import time
import os

# Configuration
API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:5000/api/parking")
CAMERA_SOURCE = 0 # 0 for default webcam, or provide an RTSP stream URL
CHECK_INTERVAL_SEC = 5

# Mock mappings between pixel regions (x, y, w, h) and slot IDs in the database
SLOTS_MAPPING = {
    1: {"rect": (50, 50, 100, 150), "status": "available", "id": 1, "threshold": 100},
    2: {"rect": (200, 50, 100, 150), "status": "available", "id": 2, "threshold": 100},
}

def update_slot_status(slot_id, status):
    print(f"Updating slot {slot_id} to {status}...")
    try:
        url = f"{API_BASE_URL}/slots/{slot_id}/status"
        payload = {"status": status}
        response = requests.put(url, json=payload)
        if response.status_code == 200:
            print(f"Successfully updated slot {slot_id}.")
        elif response.status_code == 404:
            print(f"Slot {slot_id} not found in DB.")
        else:
            print(f"Failed to update slot {slot_id}: {response.text}")
    except requests.exceptions.ConnectionError:
        print(f"Backend API is unreachable at {API_BASE_URL}")
    except Exception as e:
        print(f"API Error updating slot {slot_id}: {e}")

def detect_occupancy():
    """
    Very basic mock contour/pixel density based occupancy detection
    for a fixed camera. In a production scenario, this would use YOLOv8.
    """
    cap = cv2.VideoCapture(CAMERA_SOURCE)
    if not cap.isOpened():
        print("Camera could not be opened. Falling back to mock loop.")
        mock_loop()
        return

    last_check = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break

        # Process frame every N seconds to save CPU
        current_time = time.time()
        should_check = (current_time - last_check) > CHECK_INTERVAL_SEC
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
        for key, slot in SLOTS_MAPPING.items():
            x, y, w, h = slot["rect"]
            roi = gray[y:y+h, x:x+w]
            
            # Simple simulation: if the region is darker than threshold, consider occupied
            avg_brightness = np.mean(roi)
            
            if should_check:
                is_occupied = avg_brightness < slot["threshold"]
                new_status = 'occupied' if is_occupied else 'available'
                
                if new_status != slot["status"]:
                    print(f"Slot {slot['id']} changed to {new_status} (brightness: {avg_brightness:.2f})")
                    slot["status"] = new_status
                    update_slot_status(slot["id"], new_status)
            
            # Draw overlay
            color = (0, 0, 255) if slot["status"] == 'occupied' else (0, 255, 0)
            cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(frame, f"ID:{slot['id']} {slot['status']}", (x, y-10), 
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
                
        if should_check:
            last_check = current_time
            
        cv2.imshow("ParkEase CV Module", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def mock_loop():
    """Mocks alternating status every 10 seconds for testing without a real camera."""
    print("Starting mock CV loop. Status will alternate every 10 seconds.")
    try:
        while True:
            for key, slot in SLOTS_MAPPING.items():
                new_status = 'occupied' if slot['status'] == 'available' else 'available'
                slot['status'] = new_status
                update_slot_status(slot['id'], new_status)
            time.sleep(10)
    except KeyboardInterrupt:
        print("Mock loop stopped.")

if __name__ == "__main__":
    import sys
    # Use 'mock' argument to run without attempting camera
    if len(sys.argv) > 1 and sys.argv[1] == 'mock':
        mock_loop()
    else:
        detect_occupancy()
