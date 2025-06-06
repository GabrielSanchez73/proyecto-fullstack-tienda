@echo off
echo Cerrando puertos 8080 y 5173...

:: Cerrar puerto 8080 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo Cerrando proceso del puerto 8080 (PID: %%a)
    taskkill /F /PID %%a 2>nul
    if errorlevel 1 echo No se pudo cerrar el proceso %%a
)

:: Cerrar puerto 5173 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo Cerrando proceso del puerto 5173 (PID: %%a)
    taskkill /F /PID %%a 2>nul
    if errorlevel 1 echo No se pudo cerrar el proceso %%a
)

:: Esperar un momento para que los procesos se cierren
timeout /t 2 /nobreak >nul

:: Verificar que los puertos estén cerrados
echo.
echo Verificando estado de los puertos...
netstat -ano | findstr :8080
netstat -ano | findstr :5173

echo.
echo Proceso completado.
pause 