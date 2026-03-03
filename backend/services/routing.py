import math
import heapq

def heuristic(a, b):
    # Manhattan distance on grid, or Euclidean distance
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

def a_star_search(start_coords, goal_coords):
    # A simplified A* implementation for geospatial mapping.
    # In a real city grid we'd use OpenStreetMap nodes (OSMnx).
    # Here we simulate grid routing logic by calculating direct distance heuristics
    # and returning the heuristic cost as the "route distance".
    
    # We will just return the straight-line heuristic distance for now
    # as a functional placeholder for the algorithm structure.
    return heuristic(start_coords, goal_coords)

def get_nearest_lot(user_lat, user_lng, lots):
    """
    Given a user's location and a list of park lots,
    run A* heuristic to determine the absolute nearest lot and return its ID.
    """
    if not user_lat or not user_lng or not lots:
        return None
        
    user_pos = (float(user_lat), float(user_lng))
    
    nearest_lot_id = None
    min_dist = float('inf')
    
    for lot in lots:
        # If lot has no coordinates, ignore.
        if lot.latitude is None or lot.longitude is None:
            continue
            
        lot_pos = (lot.latitude, lot.longitude)
        
        # Calculate A* heuristic distance route length
        distance = a_star_search(user_pos, lot_pos)
        
        if distance < min_dist:
            min_dist = distance
            nearest_lot_id = lot.id
            
    return nearest_lot_id
