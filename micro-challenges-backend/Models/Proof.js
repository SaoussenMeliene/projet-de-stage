const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema({
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
  comment: { type: String },
  fileUrl: { type: String }, // Ex : "uploads/169998-file.jpg"
  status: {
    type: String,
    enum: ["en attente", "validée", "refusée"],
    default: "en attente"
  }
}, { timestamps: true });

module.exports = mongoose.model("Proof", proofSchema);
