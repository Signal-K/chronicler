/**
 * Bee Garden – Electron host shell
 *
 * Loads the Godot web export from `public/godot/index.html` inside a
 * chromium-backed BrowserWindow. Falls back to the Expo web dev server
 * when the Godot export is not present.
 *
 * Usage:
 *   npm run electron          # Loads built Godot export from dist/
 *   GODOT_DEV=1 npm run electron  # Loads Expo web dev server instead
 */

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const GODOT_HTML = path.join(__dirname, '..', 'public', 'godot', 'index.html');
const EXPO_DEV_URL = process.env.EXPO_DEV_URL || 'http://localhost:8081';
const DEV_MODE = process.env.GODOT_DEV === '1' || process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 430,
    height: 932,
    minWidth: 320,
    minHeight: 568,
    resizable: true,
    backgroundColor: '#000000',
    title: 'Bee Garden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      // Allow SharedArrayBuffer required by Godot web export
      experimentalFeatures: true,
    },
  });

  win.setMenuBarVisibility(false);

  if (DEV_MODE) {
    console.log('[electron] DEV mode – loading Expo web dev server:', EXPO_DEV_URL);
    win.loadURL(EXPO_DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
    return;
  }

  if (fs.existsSync(GODOT_HTML)) {
    console.log('[electron] Loading Godot export from:', GODOT_HTML);
    win.loadFile(GODOT_HTML);
  } else {
    console.warn(
      '[electron] Godot export not found at public/godot/index.html.\n' +
      '  Export the Godot project for Web and place the output in public/godot/.\n' +
      '  Falling back to Expo web dev server at ' + EXPO_DEV_URL,
    );
    win.loadURL(EXPO_DEV_URL);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Open external links in the system browser rather than inside Electron.
app.on('web-contents-created', (_event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
});

// Bridge: renderer can call window.electronBridge.sendEvent(name, payload)
ipcMain.handle('bridge-event', (_event, name, payload) => {
  console.log('[bridge]', name, payload);
  // TODO: forward events to/from Godot as needed.
  return { ok: true };
});
