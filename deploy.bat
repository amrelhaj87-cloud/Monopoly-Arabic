@echo off
echo ===================================================
echo   Amlak ^& Aqaarat - Git Push ^& Vercel Auto Deploy
echo ===================================================
echo.

echo [1/3] Building and verifying TypeScript bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed! Aborting deploy.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Adding changes and committing to Git...
set COMMIT_MSG=Update & deploy %date% %time%
if not "%~1"=="" set COMMIT_MSG=%~1

git add .
git commit -m "%COMMIT_MSG%"

echo.
echo [3/3] Pushing to GitHub (Vercel will auto-build & deploy)...
git push

echo.
echo ===================================================
echo   [SUCCESS] Pushed to GitHub! Vercel is deploying.
echo ===================================================
pause
