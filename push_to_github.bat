@echo off
set "PATH=C:\Users\lenovo\.tools\git\cmd;%PATH%"
cd /d "d:\jodhpur voyage\backend"
echo ========================================================
echo   Uploading Jodhpur Voyage Backend to GitHub...
echo ========================================================
echo.
git push -u origin main
echo.
echo ========================================================
echo   Done! Check your repository:
echo   https://github.com/jodhpurvoyageinde/JodhpurVoyage
echo ========================================================
pause
