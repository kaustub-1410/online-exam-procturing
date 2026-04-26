@echo off
echo Starting AI Proctoring System...

:: Starting Backend from root and using the venv
start cmd /k ".\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8001"

:: Starting Frontend
start cmd /k "cd frontend && npm run dev"

echo Servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:8001 (API: http://localhost:8001/docs)
pause

