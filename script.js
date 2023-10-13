const { ipcRenderer } = require('electron');

document.getElementById('loadDataBtn').addEventListener('click', async () => {
  const data = await ipcRenderer.sendSync('get-data');
  if (data.error) {
    console.error(data.error);
    return;
  }

  console.log(data);
});