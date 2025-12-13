const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data', 'database.sqlite');

function initDb() {
  const fs = require('fs');
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const db = new sqlite3.Database(DB_PATH);
  db.serialize(() => {
    // tables are created by migrate.js, but keep this to ensure DB file exists
  });
  db.close();
}

function getDb() {
  const db = new sqlite3.Database(DB_PATH);
  return db;
}

module.exports = { initDb, getDb, DB_PATH };
