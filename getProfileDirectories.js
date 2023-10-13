const fs = require('fs');
const path = require('path');

const getProfileDirectories = (dirPath) => {
  // 指定したディレクトリの内容を取得
  const filesAndDirectories = fs.readdirSync(dirPath);

  // "Profile" で始まるディレクトリだけをフィルタリング
  const profileDirectories = filesAndDirectories.filter(item => {
    return item.startsWith('Profile');
  });

  return profileDirectories;
};

module.exports = getProfileDirectories;
