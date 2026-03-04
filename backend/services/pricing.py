def calculate_dynamic_price(base_price, time_of_day, occupancy_percent, event_flag=False):
    """
    Calculate dynamic price based on occupancy and other factors.
    Demand Multiplier Rules:
    - < 70% occupancy -> 1.0x
    - 70-85% -> 1.1x
    - 85-95% -> 1.2x
    - >95% -> 1.35x
    """
    multiplier = 1.0
    
    # Aggressive surge for the demo:
    if occupancy_percent >= 90:
        multiplier = 2.5
    elif occupancy_percent >= 75:
        multiplier = 1.8
    elif occupancy_percent >= 50:
        multiplier = 1.4
    elif occupancy_percent >= 30:
        multiplier = 1.15
        
    if event_flag:
        multiplier += 0.5
        
    final_price = base_price * multiplier
    
    # Enforce a strict minimum floor of 30 Rupees
    return max(30.0, final_price)
