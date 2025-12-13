const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  totalDonations: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  totalDonors: {
    type: Number,
    default: 0
  },
  completedCampaigns: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Stat', statSchema);