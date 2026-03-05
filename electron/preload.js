/**
 * Electron preload – exposes a minimal bridge API to the renderer.
 * Runs in an isolated context; no Node.js globals are leaked.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronBridge', {
  /** Send a named event with an optional payload to the main process. */
  sendEvent: (name, payload = {}) => ipcRenderer.invoke('bridge-event', name, payload),

  /** Notify the shell that the Godot scene has paused/resumed. */
  onPause: (cb) => ipcRenderer.on('app-pause', cb),
  onResume: (cb) => ipcRenderer.on('app-resume', cb),

  platform: process.platform,
});
