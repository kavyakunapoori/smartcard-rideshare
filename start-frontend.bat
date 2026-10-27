@echo off
title Smart Carpool - Frontend (Port 5173)
echo ========================================================
echo  Starting Smart Carpool Frontend (Vite + React)
echo ========================================================
cd /d "%~dp0frontend"
call npm.cmd run dev
pause
