#!/bin/bash

# Navigate to backend folder, activate virtual environment, and run FastAPI server
source venv/bin/activate || { echo "Failed to activate virtual environment"; exit 1; }
cd backend || { echo "Backend folder not found"; exit 1; }
uvicorn main:app --reload &  # Run in background
sleep 2  # Wait for the server to start
cd ..

# Navigate to chat-backend folder and run npm
cd chat-backend || { echo "Chat-backend folder not found"; exit 1; }
npm run dev &  # Run in background
sleep 2
cd ..

# Navigate to frontend folder and run npm
cd frontend || { echo "Frontend folder not found"; exit 1; }
npm run dev

# Keep the script running to monitor processes
wait
