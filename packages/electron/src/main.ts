/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { app, BrowserWindow } from "electron";
import path from "path";

(function warnIfElectronOutsideSupportedBand(): void {
  const raw = process.versions.electron;
  if (raw == null || raw === "") return;
  const major = parseInt(String(raw).split(".")[0] ?? "", 10);
  if (!Number.isFinite(major) || (major >= 39 && major <= 41)) return;
  console.warn(
    `[Morphology Explorer] Electron major ${major} is outside the supported band (39–41).`,
  );
})();

const isDev = process.argv.includes("--dev");

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 500,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "Morphology Explorer",
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    const appDist = path.join(__dirname, "../../app/dist");
    mainWindow.loadFile(path.join(appDist, "index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
