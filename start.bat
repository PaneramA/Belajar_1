@echo off
echo ================================================
echo   Starting Metabase API Demo...
echo ================================================
echo.

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detected! Starting server...
echo.

REM Start the server
node server.js

pause
