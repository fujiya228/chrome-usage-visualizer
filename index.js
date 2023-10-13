const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const os = require('os');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  const username = os.userInfo().username;
  console.log(username);

  fs.readFile(`/Users/${username}/Library/Application Support/Google/Chrome/Default/History`, 'utf8', (err, data) => {
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