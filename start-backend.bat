@echo off
title Smart Carpool - Backend (Port 8080)
echo ========================================================
echo  Starting Smart Carpool Backend (Spring Boot + MySQL)
echo ========================================================
cd /d "%~dp0backend"
call mvnw.cmd spring-boot:run
pause
