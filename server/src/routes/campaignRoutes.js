const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// GET /api/campaigns - Get all campaigns
router.get('/', campaignController.getCampaigns);

// GET /api/campaigns/:id - Get single campaign
router.get('/:id', campaignController.getCampaign);

// POST /api/campaigns - Create new campaign
router.post('/', campaignController.createCampaign);

module.exports = router;