// db.js
// 使用 sqlite3 來操作資料庫，並開啟 db/sqlite.db，若不存在則自動建立
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');
const dbPath = path.join(dbDir, 'sqlite.db');

// 確保 db 資料夾存在
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir);
}

// 開啟資料庫（若不存在會自動建立）
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('成功開啟資料庫:', dbPath);
    }
});

module.exports = db;
