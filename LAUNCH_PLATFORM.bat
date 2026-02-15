@echo off
title GRAVITY OSINT PLATFORM - SERVER
color 0b

cls
echo ========================================================
echo        GRAVITY OSINT PLATFORM | SYSTEM STARTUP
echo ========================================================
echo.
echo [1] Initializing Secure Local Environment...
echo [2] Loading Modules (Graph, Map, AI Engine)...
echo [3] Establishing Neural Uplink...
echo.

:: Check for Python to run a proper server (better than file://)
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python Environment Detected.
    echo [INFO] Starting Secure Local Server on Port 8080...
    echo.
    echo      >> ACCESS THE PLATFORM AT: http://localhost:8080
    echo.
    start "" "http://localhost:8080/index.html"
    python -m http.server 8080
) else (
    echo [WARN] Python not found. Falling back to File System Mode.
    echo [INFO] Advanced browser security features might limit some APIs.
    timeout /t 2 >nul
    start "" "index.html"
)

pause
