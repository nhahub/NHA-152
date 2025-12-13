const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/contact - Send contact message
router.post('/', contactController.sendMessage);

// GET /api/contact - Get all messages
router.get('/', contactController.getMessages);

module.exports = router;