@echo off
cd /d "d:\jodhpur_voyage01022026updated\jodhpur_voyage\backend"
echo ========================================================
echo   Uploading Jodhpur Voyage Backend to GitHub...
echo ========================================================
echo.
git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Git push failed due to permission/credential issue.
    echo Clearing cached credentials so you can log in as 'jodhpurvoyageinde'...
    cmdkey /delete:LegacyGeneric:target=git:https://github.com
    echo.
    echo Retrying git push...
    git push -u origin main
)
echo.
echo ========================================================
echo   Done! Check your repository:
echo   https://github.com/jodhpurvoyageinde/JodhpurVoyage
echo ========================================================
pause

