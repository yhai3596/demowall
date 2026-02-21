#!/bin/bash
echo "Starting Demowall Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"
cd ..
sleep 2
echo ""
echo "Starting Frontend Server..."
echo "Frontend: http://localhost:8000"
echo "Backend: http://localhost:3000"
echo ""
python -m http.server 8000
