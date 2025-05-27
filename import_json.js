// import_json.js
// 將指定的 JSON 檔案匯入 SQLite 資料庫 oyster_prices 資料表
const fs = require('fs');
const path = require('path');
const db = require('./db');

// 將要匯入的 JSON 檔案名稱改為現有的牡蠣價格資料檔案
const jsonFileName = '3f22734f46b814a22e7585dc6b1cea99_export.json';
const jsonPath = path.join(__dirname, jsonFileName);

if (!fs.existsSync(jsonPath)) {
    console.error('找不到 JSON 檔案:', jsonPath);
    process.exit(1);
}

const rawData = fs.readFileSync(jsonPath, 'utf8');
let data;
try {
    data = JSON.parse(rawData);
} catch (e) {
    console.error('JSON 格式錯誤:', e.message);
    process.exit(1);
}

const createTableSQL = `
CREATE TABLE IF NOT EXISTS oyster_prices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dname1 TEXT,
    date TEXT,
    value REAL,
    unit TEXT
);
`;

db.serialize(() => {
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('建立資料表失敗:', err.message);
            process.exit(1);
        }
        const insertSQL = 'INSERT INTO oyster_prices (dname1, date, value, unit) VALUES (?, ?, ?, ?)';
        const stmt = db.prepare(insertSQL);
        data.forEach(item => {
            stmt.run(item.dname1, item.date, item.value, item.unit);
        });
        stmt.finalize();
        console.log('匯入完成！');
        db.close();
    });
});
