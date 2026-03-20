@echo off
echo Starting AI Proctoring System...

start cmd /k "cd backend && venv\Scripts\activate && uvicorn backend.main:app --reload --port 8001"
start cmd /k "cd frontend && npm run dev -- --webpack"

echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8001
pause
