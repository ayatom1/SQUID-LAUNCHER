const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#000000',
    frame: false, // Frameless for custom titlebar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../out/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Open DevTools in dev mode
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Window Controls
  ipcMain.on('window-control', (event, action) => {
    switch (action) {
      case 'minimize':
        mainWindow.minimize();
        break;
      case 'maximize':
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize();
        } else {
          mainWindow.maximize();
        }
        break;
      case 'close':
        mainWindow.close();
        break;
    }
  });

  // Auto-Update Download Logic
  ipcMain.on('download-update', async (event, url) => {
    const fs = require('fs');
    const axios = require('axios');
    const downloadPath = path.join(app.getPath('temp'), 'SquidLauncherSetup.exe');

    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
      });

      const totalLength = response.headers['content-length'];
      const writer = fs.createWriteStream(downloadPath);
      let downloaded = 0;

      response.data.on('data', (chunk) => {
        downloaded += chunk.length;
        const progress = (downloaded / totalLength) * 100;
        mainWindow.webContents.send('download-progress', progress);
      });

      response.data.pipe(writer);

      writer.on('finish', () => {
        mainWindow.webContents.send('download-complete', downloadPath);
      });

      writer.on('error', (err) => {
        console.error("File write error", err);
        mainWindow.webContents.send('download-error', err.message);
      });

    } catch (error) {
      console.error("Download error", error);
      mainWindow.webContents.send('download-error', error.message);
    }
  });

  // Install Update (Run Installer)
  ipcMain.on('install-update', (event, filePath) => {
    const { shell } = require('electron');
    shell.openPath(filePath);
    setTimeout(() => {
      app.quit();
    }, 1000);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
