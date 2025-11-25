@echo off
echo Starting SCMS development environment...

echo Starting backend server...
start cmd /k "cd scms-backend && npm start"

timeout /t 5

echo Starting frontend server...
start cmd /k "cd scms-frontend && npm run dev"

echo.
echo Development servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.