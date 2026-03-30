@echo off
REM Quick Start Script for SecureNote Application
REM Run this script to start both frontend and backend servers

echo ======================================
echo   SecureNote - Quick Start
echo ======================================
echo.
echo Starting Backend Server (Terminal 1)...
start cmd /k "cd /d c:\Parn\backend && powershell -ExecutionPolicy Bypass -Command 'npm start'"

echo Starting Frontend Server (Terminal 2) in 3 seconds...
timeout /t 3 /nobreak

start cmd /k "cd /d c:\Parn\frontend && powershell -ExecutionPolicy Bypass -Command 'npm run dev'"

echo.
echo ======================================
echo   Servers Starting!
echo ======================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause
