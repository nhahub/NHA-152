const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const db = getDb();
  db.run('INSERT INTO users (id, name, email, password) VALUES (?,?,?,?)', [id, name||'', email, hashed], function(err) {
    db.close();
    if (err) return res.status(400).json({ error: err.message });
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name, email } });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDb();
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    db.close();
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: row.id, email: row.email, is_admin: row.is_admin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: row.id, name: row.name, email: row.email } });
  });
});

module.exports = router;
