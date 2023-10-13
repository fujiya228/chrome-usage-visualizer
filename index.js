const { app, BrowserWindow } = require('electron')
const fs = require('fs');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  fs.readFile('./renovate.json', 'utf8', (err, data) => {
    if (err) {
      console.error('An error occurred:', err);
      return;
    }
    console.log(data);
  });
})

app.on('window-all-closed', () => {
  app.quit()
})