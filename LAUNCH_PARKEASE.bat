@echo off
color 0B
echo.
echo ====================================================
echo        🚀 LAUNCHING PARKEASE ECOSYSTEM 🚀
echo ====================================================
echo.
echo ⏳ Starting Backend API...
start "ParkEase API Server" cmd /k "cd backend && set FLASK_APP=app.py && C:\Users\JAYAN\anaconda3\python.exe -m flask run"

TIMEOUT /T 3 /NOBREAK >nul
echo ⏳ Starting Synthetic CV Feeds...
start "Synthetic Node Sim" cmd /k "cd backend && C:\Users\JAYAN\anaconda3\python.exe synthetic_cv.py"

TIMEOUT /T 2 /NOBREAK >nul
echo ⏳ Starting OpenCV Real Camera Feeds...
start "Live OpenCV Agent" cmd /k "cd EasyPark\car-parking-detection && C:\Users\JAYAN\anaconda3\python.exe main.py"

TIMEOUT /T 2 /NOBREAK >nul
echo ⏳ Starting React Dashboard UI...
start "React Frontend" cmd /k "cd frontend_web && npm run dev"

echo.
echo ====================================================
echo ✅ ALIGNMENT OPTIMAL. SYSTEM OPERATIONAL. ✅
echo    1. Database Pipeline Active
echo    2. Camera Bounding Boxes Analyzing
echo    3. React UI Polling Backend
echo.
echo    Open your browser to: http://localhost:5173
echo ====================================================
echo.
pause
