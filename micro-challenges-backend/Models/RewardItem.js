const mongoose = require('mongoose');

const rewardItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { 
    type: String,
    enum: ['Écologique', 'Sportif', 'Créatif', 'Éducatif', 'Solidaire', 'Bien-être'],
    required: true 
  },
  pointsCost: { type: Number, required: true, min: 1 },
  image: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: -1 }, // -1 = stock illimité
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimedBy: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    claimedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("RewardItem", rewardItemSchema);