@echo off
REM Lunes Keep-Alive - Install as Windows Scheduled Task
REM Run this script as Administrator

echo ============================================================
echo  Lunes Keep-Alive - Scheduled Task Setup
echo ============================================================
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Please run this script as Administrator!
    echo Right-click - Run as administrator
    pause
    exit /b 1
)

REM Create scheduled task to run every 7 days
schtasks /create /tn "Lunes-KeepAlive" /tr "pythonw D:\opencode\Lunes-node\lunes-host\keep-alive.py" /sc daily /st 08:00 /f

if %errorLevel% equ 0 (
    echo.
    echo ============================================================
    echo  Scheduled task created successfully!
    echo ============================================================
    echo  Task Name: Lunes-KeepAlive
    echo  Schedule:  Daily at 08:00
    echo  Script:    D:\opencode\Lunes-node\lunes-host\keep-alive.py
    echo.
    echo  The script runs in background and keeps your server alive.
    echo ============================================================
) else (
    echo.
    echo Failed to create scheduled task.
    echo Make sure you are running as Administrator.
)

pause
