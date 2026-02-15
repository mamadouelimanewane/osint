@echo off
title GRAVITY OSINT | CORE TERMINAL
color 0f

echo ========================================================
echo        GRAVITY SYSTEM STARTUP | PORT 8080
echo ========================================================
echo.
echo [SYSTEM] Initializing Python Backend Environment...
echo [SYSTEM] Binding Localhost Port 8080...
echo [SYSTEM] Enabling Remote Command Execution (RCE) Module...
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python Found. Starting Gravity Core Server...
    echo.
    echo      >> SYSTEM LIVE AT: http://localhost:8080
    echo.
    start "" "http://localhost:8080"
    python server.py
) else (
    echo [ERROR] Python not found in PATH.
    echo System requires Python to execute real network commands.
    echo.
    echo Please install Python and add to PATH.
    pause
)
