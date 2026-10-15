@echo off
chcp 65001 >nul
cd /d "%~dp0"
set "RAMA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%RAMA_NODE%" goto launch
set "RAMA_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Revisa las instrucciones del archivo README.md.
  pause
  exit /b 1
)
:launch
"%RAMA_NODE%" scripts/start-preview.mjs
if errorlevel 1 pause
