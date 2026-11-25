@echo off
cd /d "%~dp0"
start "" http://localhost:4310
node kantor\server.cjs
pause
