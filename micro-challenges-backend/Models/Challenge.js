
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  startDate: Date,
  endDate: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  participants: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
}]

});

module.exports = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
