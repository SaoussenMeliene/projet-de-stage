const mongoose = require('mongoose');

const rewardClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rewardItem: { type: mongoose.Schema.Types.ObjectId, ref: 'RewardItem', required: true },
  pointsSpent: { type: Number, required: true },
  status: { 
    type: String,
    enum: ['pending', 'approved', 'rejected', 'delivered'],
    default: 'pending'
  },
  adminNotes: { type: String, default: '' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("RewardClaim", rewardClaimSchema);