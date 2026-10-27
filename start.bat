@echo off
title Smart Carpool - System Launcher
echo ========================================================
echo   Launching Smart Carpool Full Stack System
echo   - Backend:  http://localhost:8080 (Spring Boot + MySQL)
echo   - Frontend: http://localhost:5173 (React + Vite)
echo ========================================================
echo.
echo 1. Starting Backend server in a new window...
start "Smart Carpool - Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"

echo 2. Starting Frontend server in a new window...
start "Smart Carpool - Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo Both services have been launched!
echo Open http://localhost:5173 in your browser once the servers are up.
echo.
echo Demo Accounts:
echo   - Admin:     admin@carpool.com     / Admin@123
echo   - Driver:    john.driver@carpool.com / User@123
echo   - Passenger: alex.rider@carpool.com   / User@123
echo ========================================================
