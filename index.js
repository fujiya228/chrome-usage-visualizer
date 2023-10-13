const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html')
}

app.whenReady().then(createWindow);

ipcMain.on('get-data', async (event) => {
  const username = os.userInfo().username;
  console.log(username);

  const allProfileRows = [];

  const dbPath = `/Users/${username}/Library/Application Support/Google/Chrome/Default/History`;
  const tempPath = path.join(__dirname, 'tempHistoryCopy');

  fs.copyFileSync(dbPath, tempPath);

  const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000 * 1000; // 2週間分のマイクロ秒
  const now = new Date().getTime();
  const chromeEpoch = new Date('1601-01-01T00:00:00Z').getTime();

  // Chromeのエポックからの現在のマイクロ秒
  const currentMicroseconds = (now - chromeEpoch) * 1000;
  const twoWeeksAgoMicroseconds = currentMicroseconds - TWO_WEEKS;

  const db = new sqlite3.Database(tempPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
      event.returnValue = { error: err.message };
      return;
    }
    console.log('Connected to the database.');
  });

  const query = `
    SELECT url, title, last_visit_time
    FROM urls
    WHERE last_visit_time > ?
    ORDER BY last_visit_time DESC
`;

  try {
    const rows = await new Promise((resolve, reject) => {
      db.all(query, [twoWeeksAgoMicroseconds], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });

    const tmpRows = rows.map((row) => {
      const visitDate = new Date((row.last_visit_time / 1000) + chromeEpoch);
      return [
        row.url,
        row.title,
        visitDate
      ];
    });

    allProfileRows.push(...tmpRows);
    event.returnValue = allProfileRows;
  } catch (err) {
    console.error(err.message);
    event.returnValue = { error: err.message };
  } finally {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Closed the database connection.');
      }
    });
  }
})

app.on('window-all-closed', () => {
  app.quit()
})