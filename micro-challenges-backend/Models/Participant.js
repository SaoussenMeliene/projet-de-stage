const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["en attente", "confirmé", "refusé"],
    default: "en attente"
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  proof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proof"
  }
});

module.exports = mongoose.models.Participant || mongoose.model("Participant", participantSchema);

