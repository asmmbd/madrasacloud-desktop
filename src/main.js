const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  shell,
  ipcMain,
  nativeImage,
  dialog,
  Notification,
  session,
  globalShortcut,
} = require("electron");
const path = require("path");
const fs = require("fs");
const { autoUpdater } = require("electron-updater");

// ══════════════════════════════
// CONFIG
// ══════════════════════════════
const APP_URL   = "https://www.madrasacloud.xyz";
const APP_NAME  = "Madrasa Cloud";
const IS_DEV    = process.argv.includes("--dev");
const ICON_PATH = path.join(__dirname, "../assets/icon.png");
const CSS_PATH   = path.join(__dirname, "../assets/custom.css");

let mainWindow   = null;
let splashWindow = null;
let tray         = null;
let isQuitting   = false;

// ══════════════════════════════
// CSS INJECTION
// ══════════════════════════════
function injectCustomCSS() {
  try {
    if (fs.existsSync(CSS_PATH)) {
      const css = fs.readFileSync(CSS_PATH, 'utf8');
      mainWindow.webContents.insertCSS(css);
      console.log('Custom CSS injected successfully');
    } else {
      // Create default CSS file if it doesn't exist
      createDefaultCSS();
    }
  } catch (error) {
    console.error('Failed to inject CSS:', error);
  }
}

function createDefaultCSS() {
  try {
    const defaultCSS = `
/* MadrasaCloud Desktop Custom CSS */
/* Add your custom styles here */

/* Example: Hide unwanted elements */
/* .unwanted-element { display: none !important; } */

/* Example: Custom app background */
/* body { background: #f0f0f0 !important; } */

/* Example: Custom header styling */
/* .header { background: linear-gradient(45deg, #10b981, #059669) !important; } */

/* Example: Custom button styling */
/* .btn-primary { background: #10b981 !important; border: none !important; } */
`;
    fs.writeFileSync(CSS_PATH, defaultCSS, 'utf8');
    console.log('Default CSS file created:', CSS_PATH);
  } catch (error) {
    console.error('Failed to create default CSS:', error);
  }
}

// ══════════════════════════════
// SPLASH SCREEN
// ══════════════════════════════
function createSplash() {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 280,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splashWindow.loadFile(path.join(__dirname, "splash.html"));
}

// ══════════════════════════════
// MAIN WINDOW
// ══════════════════════════════
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    title: APP_NAME,
    icon: ICON_PATH,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });

  mainWindow.loadURL(APP_URL);

  // Inject custom CSS when page loads
  mainWindow.webContents.on('dom-ready', () => {
    injectCustomCSS();
  });

  mainWindow.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      if (splashWindow && !splashWindow.isDestroyed()) {
        splashWindow.close();
        splashWindow = null;
      }
      mainWindow.show();
      mainWindow.focus();
    }, 1200);
  });

  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadFile(path.join(__dirname, "offline.html"));
  });

  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      showTrayNotification();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith(APP_URL)) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  if (IS_DEV) {
    mainWindow.webContents.openDevTools();
  }
}

// ══════════════════════════════
// SYSTEM TRAY
// ══════════════════════════════
function createTray() {
  try {
    const icon = nativeImage.createFromPath(ICON_PATH);

    let trayIcon = icon;
    if (process.platform === "darwin") {
      trayIcon = icon.resize({ width: 22, height: 22 });
    } else {
      trayIcon = icon.resize({ width: 16, height: 16 });
    }

    tray = new Tray(trayIcon);
    tray.setToolTip(APP_NAME);

    const contextMenu = Menu.buildFromTemplate([
      { 
        label: "🕌 MadrasaCloud খুলুন", 
        click: () => { 
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show(); 
            mainWindow.focus(); 
          }
        } 
      },
      { type: "separator" },
      { 
        label: "🔄 রিলোড করুন", 
        click: () => { 
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.show(); 
            mainWindow.webContents.reload(); 
          }
        } 
      },
      { 
        label: "🌐 ব্রাউজারে খুলুন", 
        click: () => {
          try {
            shell.openExternal(APP_URL);
          } catch (error) {
            console.error("Failed to open external URL:", error);
          }
        } 
      },
      { type: "separator" },
      { 
        label: "ℹ️ সম্পর্কে", 
        click: () => showAbout() 
      },
      { type: "separator" },
      { 
        label: "❌ বন্ধ করুন", 
        click: () => { 
          isQuitting = true; 
          app.quit(); 
        } 
      },
    ]);

    tray.setContextMenu(contextMenu);

    tray.on("click", () => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        if (mainWindow.isVisible()) {
          mainWindow.focus();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });

    console.log('Tray created successfully');
  } catch (error) {
    console.error('Failed to create tray:', error);
  }
}

// ══════════════════════════════
// HELPERS
// ══════════════════════════════
function showAbout() {
  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showMessageBox(mainWindow, {
        type:    "info",
        title:   "MadrasaCloud সম্পর্কে",
        message: "MadrasaCloud Desktop",
        detail:  `Version: ${app.getVersion()}\nওয়েবসাইট: ${APP_URL}\n\nমাদরাসা ম্যানেজমেন্ট সিস্টেম`,
        buttons: ["ঠিক আছে"],
        icon:    ICON_PATH,
      });
    }
  } catch (error) {
    console.error('Failed to show about dialog:', error);
  }
}

function showTrayNotification() {
  if (Notification.isSupported()) {
    new Notification({
      title: APP_NAME,
      body:  "অ্যাপ চলছে — Tray থেকে খুলুন",
      icon:  ICON_PATH,
    }).show();
  }
}

// ══════════════════════════════
// AUTO UPDATER
// ══════════════════════════════
function setupAutoUpdater() {
  autoUpdater.autoDownload = false;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on("update-available", (info) => {
    dialog.showMessageBox(mainWindow, {
      type:    "info",
      title:   "নতুন আপডেট পাওয়া গেছে",
      message: `ভার্সন ${info.version} উপলব্ধ`,
      detail:  "ডাউনলোড করতে চান?",
      buttons: ["হ্যাঁ, ডাউনলোড করি", "পরে"],
      cancelId: 1
    }).then(({ response }) => {
      if (response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog.showMessageBox(mainWindow, {
      type:    "info",
      title:   "আপডেট ডাউনলোড সম্পন্ন",
      message: "ইনস্টল করতে অ্যাপ রিস্টার্ট হবে।",
      buttons: ["এখনই রিস্টার্ট", "পরে"],
    }).then(({ response }) => {
      if (response === 0) autoUpdater.quitAndInstall();
    });
  });

  autoUpdater.on("error", (err) => {
    console.error("Auto-updater error:", err);
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showErrorBox("আপডেটে সমস্যা", err.message || "অজানা ত্রুটি। পরে আবার চেষ্টা করুন।");
    }
  });

  if (!IS_DEV) {
    autoUpdater.checkForUpdatesAndNotify().catch(err => console.error("Update check failed:", err));
  }
}

// ══════════════════════════════
// IPC HANDLERS
// ══════════════════════════════
ipcMain.on("minimize-window", () => {
  try {
    mainWindow?.minimize();
  } catch (error) {
    console.error("Failed to minimize window:", error);
  }
});

ipcMain.on("maximize-window", () => {
  try {
    if (mainWindow?.isMaximized()) mainWindow.unmaximize();
    else mainWindow?.maximize();
  } catch (error) {
    console.error("Failed to maximize/unmaximize window:", error);
  }
});

ipcMain.on("close-window", () => {
  try {
    mainWindow?.hide();
  } catch (error) {
    console.error("Failed to close window:", error);
  }
});

ipcMain.on("reload-window", () => {
  try {
    mainWindow?.webContents.reload();
  } catch (error) {
    console.error("Failed to reload window:", error);
  }
});

ipcMain.handle("get-app-version", () => {
  try {
    return app.getVersion();
  } catch (error) {
    console.error("Failed to get app version:", error);
    return "1.0.0";
  }
});

ipcMain.handle("get-platform", () => {
  try {
    return process.platform;
  } catch (error) {
    console.error("Failed to get platform:", error);
    return "unknown";
  }
});

ipcMain.on("clear-cache", async () => {
  try {
    await session.defaultSession.clearCache();
    mainWindow?.webContents.reload();
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showMessageBox(mainWindow, { type: "info", message: "ক্যাশ পরিষ্কার করা হয়েছে" });
    }
  } catch (error) {
    console.error("Failed to clear cache:", error);
    if (mainWindow && !mainWindow.isDestroyed()) {
      dialog.showErrorBox("ক্যাশ পরিষ্কারে সমস্যা", "ক্যাশ পরিষ্কার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    }
  }
});

ipcMain.on("reload-css", () => {
  try {
    if (mainWindow && !mainWindow.isDestroyed()) {
      injectCustomCSS();
      console.log('CSS reloaded successfully');
    }
  } catch (error) {
    console.error("Failed to reload CSS:", error);
  }
});

// ══════════════════════════════
// SINGLE INSTANCE + APP LIFECYCLE
// ══════════════════════════════
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();

      // Handle custom JumpList / command line args
      const gotoArg = commandLine.find(a => a.startsWith("--goto="));
      if (gotoArg) {
        const page = gotoArg.replace("--goto=", "");
        const urls = {
          dashboard: `${APP_URL}/dashboard`,
          students: `${APP_URL}/students`,
          attendance: `${APP_URL}/attendance`,
          fees: `${APP_URL}/fees`,
          // যদি আরও পেজ যোগ করতে চান তাহলে এখানে যোগ করুন
        };
        if (urls[page]) mainWindow.loadURL(urls[page]);
      }

      if (commandLine.includes("--action=reload")) {
        mainWindow.webContents.reload();
      }

      if (commandLine.includes("--quit")) {
        isQuitting = true;
        app.quit();
      }

      // যদি নতুন অ্যাকশন যোগ করেন (যেমন --settings) তাহলে এখানে হ্যান্ডেল করুন
      if (commandLine.includes("--settings")) {
        mainWindow.loadURL(`${APP_URL}/settings`); // অথবা আপনার settings পেজ
      }
    }
  });

  app.whenReady().then(() => {
    // Platform specific menus
    if (process.platform === "darwin") {
      Menu.setApplicationMenu(Menu.buildFromTemplate([
        { label: "Edit", submenu: [
          { role: "copy" }, { role: "paste" }, { role: "selectAll" },
          { role: "undo" }, { role: "redo" }
        ]}
      ]));
    } else {
      Menu.setApplicationMenu(null);
    }

    // Global Shortcuts
    globalShortcut.register("CmdOrCtrl+R", () => mainWindow?.webContents.reload());
    globalShortcut.register("F5", () => mainWindow?.webContents.reload());
    globalShortcut.register("CmdOrCtrl+Plus", () => mainWindow?.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5));
    globalShortcut.register("CmdOrCtrl+=", () => mainWindow?.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5));
    globalShortcut.register("CmdOrCtrl+-", () => mainWindow?.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5));
    globalShortcut.register("CmdOrCtrl+0", () => mainWindow?.webContents.setZoomLevel(0));
    globalShortcut.register("F11",               () => mainWindow?.setFullScreen(!mainWindow.isFullScreen()));

    app.on("will-quit", () => globalShortcut.unregisterAll());

    createSplash();
    createMainWindow();
    createTray();
    setupAutoUpdater();

    // Windows JumpList - টাস্কবার রাইট ক্লিক মেনু কাস্টমাইজ
    if (process.platform === "win32") {
      try {
        app.setJumpList([
          {
            type: 'custom',
            name: 'দ্রুত অ্যাকশন',
            items: [
              {
                type: 'task',
                title: '🏠 ড্যাশবোর্ড খুলুন',
                description: 'প্রধান ড্যাশবোর্ডে যান',
                program: process.execPath,
                args: '--goto=dashboard',
                iconPath: process.execPath,
                iconIndex: 0
              },
              {
                type: 'task',
                title: '👨‍🎓 ছাত্র তালিকা',
                description: 'সকল ছাত্র-ছাত্রী দেখুন',
                program: process.execPath,
                args: '--goto=students',
                iconPath: process.execPath,
                iconIndex: 0
              },
              {
                type: 'task',
                title: '✅ আজকের হাজিরা',
                description: 'হাজিরা নেয়া/দেখা',
                program: process.execPath,
                args: '--goto=attendance',
                iconPath: process.execPath,
                iconIndex: 0
              },
              {
                type: 'task',
                title: '💰 ফি সংগ্রহ',
                description: 'ফি কালেকশন ও রিপোর্ট',
                program: process.execPath,
                args: '--goto=fees',
                iconPath: process.execPath,
                iconIndex: 0
              }
            ]
          },
          {
            type: 'custom',
            name: 'অ্যাপ কন্ট্রোল',
            items: [
              {
                type: 'task',
                title: '🔄 রিফ্রেশ করুন',
                description: 'অ্যাপ রিলোড করুন',
                program: process.execPath,
                args: '--action=reload',
                iconPath: process.execPath,
                iconIndex: 0
              },
              {
                type: 'task',
                title: '⚙️ সেটিংস',
                description: 'অ্যাপ সেটিংস খুলুন',
                program: process.execPath,
                args: '--settings',
                iconPath: process.execPath,
                iconIndex: 0
              },
              {
                type: 'task',
                title: '❌ অ্যাপ বন্ধ করুন',
                description: 'সম্পূর্ণ অ্যাপ বন্ধ করুন',
                program: process.execPath,
                args: '--quit',
                iconPath: process.execPath,
                iconIndex: 0
              }
            ]
          },
          { type: 'frequent' },
          { type: 'recent' }
        ]);
        console.log('JumpList setup completed successfully');
      } catch (error) {
        console.error('Failed to setup JumpList:', error);
      }
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      } else if (mainWindow) {
        mainWindow.show();
        mainWindow.focus();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      if (isQuitting) app.quit();
    }
  });

  app.on("before-quit", () => {
    isQuitting = true;
  });
}