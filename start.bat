@echo off
echo Starting Demowall Backend Server...
cd backend
start cmd /k "npm start"
echo.
echo Backend server starting on http://localhost:3000
echo.
echo Press any key to open frontend...
pause > nul
start http://localhost:8000
cd ..
python -m http.server 8000
