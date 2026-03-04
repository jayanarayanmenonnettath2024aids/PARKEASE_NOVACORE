@echo off
color 0A
echo.
echo ====================================================
echo        📷 LAUNCHING CLOUD CV CAMERAS 📷
echo ====================================================
echo.
echo 📡 Connecting to: https://parkease-backend-isad.onrender.com
echo.

echo ⏳ Starting Synthetic Multi-Lot Simulators...
start "Synthetic CV Feeds" cmd /k "cd backend && C:\Users\JAYAN\anaconda3\python.exe synthetic_cv.py"

TIMEOUT /T 2 /NOBREAK >nul
echo ⏳ Starting OpenCV Real Camera Feeds (Lot 1)...
start "Live OpenCV Camera" cmd /k "cd EasyPark && C:\Users\JAYAN\anaconda3\python.exe main.py"

echo.
echo ====================================================
echo ✅ CAMERAS OPERATIONAL. TRANSMITTING TO CLOUD. ✅
echo    1. Synthetic Lots (2, 3) are updating dynamically
echo    2. OpenCV Bounding Boxes (Lot 1) are analyzing
echo.
echo    You can now open your Vercel React Website:
echo    https://parkease-novacore-vtqf.vercel.app
echo ====================================================
echo.
pause
