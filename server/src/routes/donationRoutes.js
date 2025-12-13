const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// POST /api/donations - Create new donation
router.post('/', donationController.createDonation);

// GET /api/donations - Get all donations
router.get('/', donationController.getDonations);

// GET /api/donations/stats - Get donation statistics
router.get('/stats', donationController.getDonationStats);

module.exports = router;  