const express = require('express');
const router = express.Router();
const { getDb } = require('../../db');

// very small admin read-only endpoints for totals
router.get('/stats', (req, res) => {
  const db = getDb();
  db.serialize(() => {
    db.get('SELECT COUNT(*) as users FROM users', [], (err, urow) => {
      if (err) { db.close(); return res.status(500).json({error: err.message}); }
      db.get('SELECT COUNT(*) as campaigns FROM campaigns', [], (err2, crow) => {
        if (err2) { db.close(); return res.status(500).json({error: err2.message}); }
        db.get('SELECT SUM(amount) as total_donations FROM donations', [], (err3, drow) => {
          db.close();
          if (err3) return res.status(500).json({error: err3.message});
          res.json({ users: urow.users, campaigns: crow.campaigns, total_donations: drow.total_donations || 0 });
        });
      });
    });
  });
});

module.exports = router;
