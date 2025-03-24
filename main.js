const { app, BrowserWindow, ipcMain } = require('electron/main');
const path = require('node:path');
const fs = require('fs');
const {dialog} = require('electron');

let mainWindow;

// Path to your songs.json file
const songsFilePath = path.join(__dirname, 'src', 'data', 'songs.json');

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    resizable: false,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'images', 'icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');
}

function ensureSongFileExists() {
  const dirPath = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  if (!fs.existsSync(songsFilePath)) {
    fs.writeFileSync(songsFilePath, JSON.stringify([], null, 2));
  }
}

/// Open Window
app.whenReady().then(() => {
  createWindow()
  ensureSongFileExists();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// ✅ Open file dialog when requested by renderer process
ipcMain.handle('open-file-dialog', async () => {

  if(!mainWindow) return null;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Music File', extensions: ['mp3', 'wav']}]
  });

  if(result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const title = path.basename(filePath, path.extname(filePath));

  console.log({title, file: filePath});

  return ({title, file: filePath});
  
});

ipcMain.on('addSong', (event, songData) => {
  try{

    let songs = [];

    if(fs.existsSync(songsFilePath)) {
      const fileContent = fs.readFileSync(songsFilePath, 'utf-8');
      songs = JSON.parse(fileContent);
    }

    const songExists = songs.some(song => song.file === songData.file || song.title === songData.title);

    if(songExists) {
      console.log(`Song already exist: ${songData.title}`);
      event.reply('data-received', {error: 'Song already exists'});
    } else {
      songs.push(songData);

      fs.writeFileSync(songsFilePath, JSON.stringify(songs, null, 2));

      console.log(`Added song: ${songData.title}`);

      event.reply('data-received', songData);
      event.sender.send('song-list-updated', songs);
    }

  } catch (error) {
    console.error('Error adding song: ', error);
    event.reply('data-received: ', {error: error.message});
  }
})

/// Close Window
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})