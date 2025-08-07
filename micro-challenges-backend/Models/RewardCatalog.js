const mongoose = require('mongoose');

const rewardCatalogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  stock: { type: Number, default: 0 },
  pointsRequired: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("RewardCatalog", rewardCatalogSchema);
