const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  badge: String,         // ex: "Green Hero"
  points: Number,        // ex: 10
  grantedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Reward", rewardSchema);
