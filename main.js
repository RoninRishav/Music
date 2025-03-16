const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 300,
    height: 450,
    resizable: false,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'images', 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

/// Open Window

app.whenReady().then(() => {

  ipcMain.handle('ping', () => 'pong')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

/// Close Window

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})