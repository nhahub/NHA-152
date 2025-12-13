const { getDb, DB_PATH } = require('./db');
const fs = require('fs');

const db = getDb();

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    goal INTEGER,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS donations (
    id TEXT PRIMARY KEY,
    campaign_id TEXT,
    user_id TEXT,
    amount INTEGER,
    currency TEXT DEFAULT 'USD',
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  console.log('Migrations applied (DB at ' + DB_PATH + ')');
  db.close();
});
