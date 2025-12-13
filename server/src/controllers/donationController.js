const Donation = require('../models/Donation');

// Create new donation
exports.createDonation = async (req, res) => {
  try {
    const { name, email, amount, donationType, currency = 'USD' } = req.body;
    
    if (!name || !email || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and amount are required'
      });
    }
    
    const donation = new Donation({
      name,
      email,
      amount: parseFloat(amount),
      donationType,
      currency,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      referrer: req.get('Referer')
    });
    
    await donation.save();
    
    res.status(201).json({
      success: true,
      message: `Thank you for your ${donationType} donation of ${currency}${amount}!`,
      data: donation
    });
    
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process donation'
    });
  }
};

// Get all donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donations'
    });
  }
};

// Get donation statistics
exports.getDonationStats = async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          averageDonation: { $avg: '$amount' },
          monthlyDonations: {
            $sum: {
              $cond: [{ $eq: ['$donationType', 'monthly'] }, 1, 0]
            }
          },
          oneTimeDonations: {
            $sum: {
              $cond: [{ $eq: ['$donationType', 'one-time'] }, 1, 0]
            }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: stats[0] || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch donation statistics'
    });
  }
};