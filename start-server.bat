@echo off
echo ================================================
echo   Metabase API Demo - Local Server
echo ================================================
echo.
echo Starting local web server...
echo.
echo Your application will be available at:
echo   http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

cd /d "%~dp0"

REM Try to use Node.js http-server if available
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js http-server...
    echo Installing http-server if needed...
    call node -e "const http=require('http'),fs=require('fs'),path=require('path');const server=http.createServer((req,res)=>{let file=req.url==='/'?'/index.html':req.url;let filePath=path.join(__dirname,file);fs.readFile(filePath,(err,data)=>{if(err){res.writeHead(404);res.end('404 Not Found');return;}const ext=path.extname(filePath);const types={'html':'text/html','css':'text/css','js':'text/javascript','json':'application/json'};res.writeHead(200,{'Content-Type':types[ext.slice(1)]||'text/plain'});res.end(data);});});server.listen(8000,()=>{console.log('Server running at http://localhost:8000/');require('child_process').exec('start http://localhost:8000');});"
    goto :end
)

REM Try Python 3
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python http.server...
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Try Python 2
where python2 >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python 2 SimpleHTTPServer...
    start http://localhost:8000
    python2 -m SimpleHTTPServer 8000
    goto :end
)

echo ERROR: No web server found!
echo Please install Node.js or Python to run this demo.
echo.
echo Download Node.js: https://nodejs.org/
echo Download Python: https://www.python.org/
pause

:end
