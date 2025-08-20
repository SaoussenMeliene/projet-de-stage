const mongoose = require("mongoose");

const proofSchema = new mongoose.Schema({
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participant",
    required: true
  },
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
  type: {
    type: String,
    enum: ["image", "text", "file", "video"],
    required: true
  },
  content: {
    type: String,
    required: true // URL pour image/video/file, ou texte pour type text
  },
  description: {
    type: String,
    required: true // Description de la preuve par l'utilisateur
  },
  fileName: {
    type: String // Nom original du fichier si applicable
  },
  fileSize: {
    type: Number // Taille du fichier en bytes
  },
  mimeType: {
    type: String // Type MIME du fichier
  },
  status: {
    type: String,
    enum: ["en_attente", "approuve", "rejete"],
    default: "en_attente"
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Admin qui a validé/rejeté
  },
  reviewedAt: {
    type: Date
  },
  reviewComment: {
    type: String // Commentaire de l'admin lors de la validation/rejet
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
proofSchema.index({ challenge: 1, status: 1 });
proofSchema.index({ user: 1, status: 1 });
proofSchema.index({ participant: 1 });

module.exports = mongoose.models.Proof || mongoose.model("Proof", proofSchema);