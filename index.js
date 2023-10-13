const { app, BrowserWindow } = require('electron')
const fs = require('fs');
const os = require('os');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

  const dbPath = `/Users/${username}/Library/Application Support/Google/Chrome/Default/History`;
  const tempPath = path.join(__dirname, 'tempHistoryCopy');

  fs.copyFileSync(dbPath, tempPath);

  const db = new sqlite3.Database(tempPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Connected to the database.');
  });

  db.all("SELECT name, sql FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return;
    }
    rows.forEach((row) => {
      console.log(`Table: ${row.name}\nSQL: ${row.sql}\n`);
    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Closed the database connection.');
  });
})

app.on('window-all-closed', () => {
  app.quit()
})