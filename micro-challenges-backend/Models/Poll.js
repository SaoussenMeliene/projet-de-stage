const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true
  },
  question: { type: String, required: true },
  options: [
    {
      text: String,
      votes: { type: Number, default: 0 }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: { type: Date, default: Date.now },
  isClosed: { type: Boolean, default: false }
});

module.exports = mongoose.model("Poll", pollSchema);
