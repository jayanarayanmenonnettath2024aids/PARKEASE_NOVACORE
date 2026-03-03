# 🚗 ParkEase - Smart Parking System

ParkEase is a full-stack smart parking solution that leverages Computer Vision, Dynamic Pricing, and cross-platform applications to modernize parking management.

## 🏗️ Architecture

### 1. Backend (Flask API)
- **Framework:** Flask + RESTful
- **Database:** SQLite (Development) / PostgreSQL (Production ready)
- **Authentication:** JWT (JSON Web Tokens)
- **Background Jobs:** APScheduler for auto-canceling expired 15-minute token bookings.
- **Dynamic Pricing Engine:** Calculates prices based on current occupancy percentage on-the-fly.

### 2. Frontend Web (React + Vite)
- **Tech:** React, Tailwind CSS, React Router, Axios, Lucide React
- **Features:** 
  - User Authentication
  - Real-time polling for slot availability
  - Interactive map/list view of parking lots
  - Booking flow with dynamic surge pricing
  - Admin Dashboard for revenue and occupancy monitoring

### 3. Frontend Mobile (React Native + Expo)
- **Tech:** Expo, React Native
- **Features:** Mobile-optimized flows for finding nearby lots, viewing slots, and securely reserving them.

### 4. Computer Vision (OpenCV)
- **Tech:** Python, OpenCV, NumPy
- **Implementation:** Processes camera feeds. Analyzes bounding boxes for brightness/contour changes to detect vehicle presence, triggering REST API `PUT` calls to update slot status in real-time.

### 5. Twilio IVR Agent
- **Tech:** Twilio Programmable Voice & SMS Python SDK
- **Implementation:** Webhooks in Flask (`/api/twilio/incoming`) handle live voice calls, read out availability via Text-to-Speech (Polly), and allow token bookings via keypad (DTMF), sending an SMS link.

---

## 🚀 Deployment Guide

### Backend Deployment (Render / Heroku / EC2)
1. Navigate to `/backend`.
2. Set environment variables:
   - `DATABASE_URL=postgresql://user:pass@host/db`
   - `SECRET_KEY=your_secret`
   - `JWT_SECRET_KEY=your_jwt_secret`
   - `TWILIO_ACCOUNT_SID=...` (and token/phone)
3. Install requirements: `pip install -r requirements.txt`
4. Run migrations/start: `gunicorn app:app` (ensure `create_app` is adjusted if using application factory).

### Web Frontend Deployment (Vercel / Netlify)
1. Navigate to `/frontend_web`.
2. Configure `.env` with `VITE_API_BASE_URL=https://your-backend.com/api`.
3. Run `npm install`, then `npm run build`.
4. Deploy the `dist` folder to Vercel or serve via Nginx.

### Mobile App Deployment
1. Navigate to `/frontend_mobile`.
2. Modify `API_URL` in `App.js` to point to your production backend.
3. Run `npx expo build:android` or `build:ios` (requires EAS CLI).

### CV Module
- Runs locally on the camera server or Edge device (Raspberry Pi/Jetson Nano).
- Set `API_BASE_URL` to the production backend endpoint.
- Run `python detector.py`.

---

## 💡 How to Run Locally

1. **Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```
2. **Web App:**
   ```bash
   cd frontend_web
   npm run dev
   ```
3. **Mobile App:**
   ```bash
   cd frontend_mobile
   npm start
   ```
4. **CV Mock:**
   ```bash
   cd cv_module
   python detector.py mock
   ```
