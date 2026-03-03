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
    
    if occupancy_percent > 95:
        multiplier = 1.35
    elif occupancy_percent >= 85:
        multiplier = 1.2
    elif occupancy_percent >= 70:
        multiplier = 1.1
        
    # Additional logic for events could be added here
    if event_flag:
        multiplier += 0.2
        
    return base_price * multiplier
