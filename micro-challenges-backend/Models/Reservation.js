const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resource: String, // ex: "Salle B1" ou "Kit Écologie"
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
  date: Date,
  status: { type: String, enum: ["en attente", "approuvée", "refusée"], default: "en attente" }
});

module.exports = mongoose.model("Reservation", reservationSchema);
