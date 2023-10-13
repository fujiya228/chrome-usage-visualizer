const { ipcRenderer } = require('electron');

// 15日前の日付を取得
const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 15);

const weekdayList = {};

// 15回ループ
for (let i = 0; i < 15; i++) {
  // 15日から1日ずつ加算（twoWeeksAgoは変化させない）
  const date = new Date(twoWeeksAgo.setDate(twoWeeksAgo.getDate() + 1));
  // 日付
  const weekdayColWeek = document.querySelector(`#weekday-${i} .weekday-header__week`);
  weekdayColWeek.textContent = date.toLocaleDateString('ja-JP', { weekday: 'short' });
  const weekdayColDate = document.querySelector(`#weekday-${i} .weekday-header__date`);
  weekdayColDate.innerHTML = `${date.getMonth() + 1}/${date.getDate()}`;

  // yyyy-mm-dd形式に変換（日本時間で）
  weekdayList[date.toLocaleDateString('ja-JP')] = i;
}

document.getElementById('loadDataBtn').addEventListener('click', async () => {
  const data = await ipcRenderer.sendSync('get-data');
  if (data.error) {
    console.error(data.error);
    return;
  }

  for (const row of data) {
    const date = new Date(row.visitDate);
    console.log(row);
    console.log(date);
    const weekday = weekdayList[date.toLocaleDateString('ja-JP')];
    console.log(weekday);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const position = (hour + minute / 60) / 24 * 100;
    const weekdayCol = document.querySelector(`#weekday-${weekday} .weekday-container`);
    const weekdayItem = document.createElement('div');
    weekdayItem.classList.add('weekday-container__item');
    weekdayItem.style.top = `${position}%`;

    weekdayCol.appendChild(weekdayItem);
  }
});