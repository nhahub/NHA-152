const Campaign = require('../models/Campaign');

// Get all campaigns
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaigns'
    });
  }
};

// Get single campaign
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }
    
    res.json({
      success: true,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch campaign'
    });
  }
};

// Create new campaign (admin)
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, imageUrl, goalAmount, category } = req.body;
    
    const campaign = new Campaign({
      title,
      description,
      imageUrl,
      goalAmount,
      category
    });
    
    await campaign.save();
    
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create campaign'
    });
  }
};