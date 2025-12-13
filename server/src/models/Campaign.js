const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  goalAmount: {
    type: Number,
    required: [true, 'Goal amount is required'],
    min: [1, 'Goal must be at least $1']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  category: {
    type: String,
    enum: ['education', 'health', 'environment', 'emergency', 'other'],
    default: 'other'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'upcoming'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate progress percentage
campaignSchema.virtual('progress').get(function() {
  return (this.currentAmount / this.goalAmount) * 100;
});

module.exports = mongoose.model('Campaign', campaignSchema);