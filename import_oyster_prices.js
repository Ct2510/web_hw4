// 匯入牡蠣價格資料到 SQLite
const fs = require('fs');
const path = require('path');
const db = require('./db');

const jsonPath = path.join(__dirname, '3f22734f46b814a22e7585dc6b1cea99_export.json');
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

// 建立資料表（若尚未存在）
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
        // 插入資料
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