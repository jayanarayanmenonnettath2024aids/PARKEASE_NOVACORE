# Frontend Map Integration Guide

To render the dynamic nearby parking lot system correctly on the frontend, follow these modifications:

## 1. Map Library
Install either `react-leaflet` (with `leaflet`) or `@react-google-maps/api`. 

## 2. API Data Structure Changes
The API at `GET /api/parking/lots?lat=USER_LAT&lng=USER_LNG` now returns new fields:
- `latitude` (Float)
- `longitude` (Float)
- `nearest` (Boolean) - True if the A* algorithm calculated this as the closest available lot from the provided lat/lng parameters.

## 3. UI Implementation
- On the `Home.jsx` component, mount the Map.
- Request the user's HTML5 Geolocation (`navigator.geolocation.getCurrentPosition`).
- Pass these coords to the backend (`?lat=x&lng=y`).
- Loop over the `lots` array from the response and place map Markers using `lot.latitude` and `lot.longitude`.
- **Styling**: If `lot.nearest === true`, highlight that specific Marker (e.g., make it larger, pulse it green, or draw a Polyline path to it from the user).
- **CV Updates**: The lot's `available_slots` and `current_price` will now fluctuate automatically based on the live CV feed checking actual cars every second!
