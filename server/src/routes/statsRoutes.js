const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats/home - Get home page statistics
router.get('/home', statsController.getHomeStats);

module.exports = router;