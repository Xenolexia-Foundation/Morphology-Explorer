/**
 * Preload script (runs in isolated context before renderer).
 * Use contextBridge here if the renderer needs safe Node/Electron APIs.
 */
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
});
