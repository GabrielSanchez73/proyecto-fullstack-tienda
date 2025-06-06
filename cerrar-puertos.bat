@echo off
echo Cerrando puertos 8080 y 5173...

:: Función para cerrar procesos por puerto
:killProcess
    setlocal enabledelayedexpansion
    set "port=%~1"
    echo Buscando procesos en el puerto %port%...
    
    :: Obtener todos los PIDs relacionados con el puerto
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%port%"') do (
        set "pid=%%a"
        if not "!pid!"=="" (
            echo Cerrando proceso (PID: !pid!)
            taskkill /F /PID !pid! 2>nul
            if errorlevel 1 (
                echo No se pudo cerrar el proceso !pid!
            ) else (
                echo Proceso !pid! cerrado exitosamente
            )
        )
    )
    endlocal
    goto :eof

:: Cerrar procesos del puerto 8080
call :killProcess 8080

:: Cerrar procesos del puerto 5173
call :killProcess 5173

:: Esperar un momento para que los procesos se cierren
timeout /t 3 /nobreak >nul

:: Verificar estado final
echo.
echo Verificando estado final de los puertos...
echo Puertos 8080:
netstat -ano | findstr ":8080"
echo.
echo Puertos 5173:
netstat -ano | findstr ":5173"

echo.
echo Proceso completado.
pause 