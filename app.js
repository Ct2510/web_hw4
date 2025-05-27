var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/sqlite.db');
const cors = require('cors');

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 查詢所有魚產價格
app.get('/api/prices', (req, res) => {
  db.all('SELECT * FROM oyster_prices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 查詢所有魚種名稱
app.get('/api/fish-list', (req, res) => {
  db.all('SELECT DISTINCT dname1 FROM oyster_prices', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(r => r.dname1));
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
