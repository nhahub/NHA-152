const Stat = require('../models/Stat');
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');

// Get home page statistics
exports.getHomeStats = async (req, res) => {
  try {
    // Get donation stats
    const donationStats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 }
        }
      }
    ]);
    
    // Get campaign stats
    const campaignStats = await Campaign.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          completedCampaigns: { $sum: 1 },
          totalRaised: { $sum: '$currentAmount' }
        }
      }
    ]);
    
    // Get unique donors count
    const uniqueDonors = await Donation.distinct('email');
    
    const stats = {
      totalDonations: donationStats[0]?.totalDonations || 0,
      totalAmount: donationStats[0]?.totalAmount || 0,
      totalDonors: uniqueDonors.length,
      completedCampaigns: campaignStats[0]?.completedCampaigns || 0,
      totalRaised: campaignStats[0]?.totalRaised || 0,
      lastUpdated: new Date()
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
}; 