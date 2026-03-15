@echo off
echo 🕌 MadrasaCloud Desktop - GitHub Setup Script
echo ============================================

:: Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

:: Add all files
echo 📝 Adding files to Git...
git add .
echo ✅ Files added to Git

:: Initial commit
echo 💾 Creating initial commit...
git commit -m "🎉 Initial release - MadrasaCloud Desktop App

✨ Features:
- Splash Screen with animations
- System Tray with context menu
- Offline page with retry functionality
- Auto updater with notifications
- Custom CSS support
- Windows JumpList integration
- Cross-platform compatibility (Windows/Mac/Linux)
- Custom menu and shortcuts
- Responsive design

🛠️ Technical:
- Electron 28.0.0
- Auto-updater integration
- IPC communication
- CSS injection system
- Error handling and logging
- Single instance enforcement"

echo ✅ Initial commit created

echo.
echo 🚀 Next Steps for GitHub Setup:
echo ==============================
echo.
echo 1. Create GitHub Repository:
echo    • Go to https://github.com/new
echo    • Repository name: madrasacloud-desktop
echo    • Description: MadrasaCloud Desktop App - Windows, Mac & Linux
echo    • Make it PUBLIC
echo    • Don't initialize with README (we already have one)
echo.
echo 2. Connect to GitHub:
echo    git remote add origin https://github.com/YOUR_USERNAME/madrasacloud-desktop.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Setup GitHub Secrets:
echo    • Go to your repository ^> Settings ^> Secrets and variables ^> Actions
echo    • Add secret: GITHUB_TOKEN (automatically available)
echo.
echo 4. Create Release:
echo    git tag v1.0.0
echo    git push origin v1.0.0
echo.
echo 5. Direct Download Links (after release):
echo    Windows: https://github.com/YOUR_USERNAME/madrasacloud-desktop/releases/latest/download/MadrasaCloud-Setup.exe
echo    Mac: https://github.com/YOUR_USERNAME/madrasacloud-desktop/releases/latest/download/MadrasaCloud.dmg
echo    Linux: https://github.com/YOUR_USERNAME/madrasacloud-desktop/releases/latest/download/MadrasaCloud.AppImage
echo.
echo 🎯 Replace YOUR_USERNAME with your actual GitHub username!
echo.
echo ✨ Your project is ready for GitHub deployment!
pause
