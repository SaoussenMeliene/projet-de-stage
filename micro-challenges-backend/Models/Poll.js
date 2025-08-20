const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  // Support pour les sondages dans les défis ET les groupes
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: false // Plus obligatoire car on peut avoir des sondages de groupe
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: false // Pour les sondages dans les groupes de discussion
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
    ref: "User",
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  isClosed: { type: Boolean, default: false },
  // Type de sondage pour différencier
  type: {
    type: String,
    enum: ['challenge', 'group'],
    required: true,
    default: 'challenge'
  }
});

// Validation : un sondage doit être lié soit à un défi soit à un groupe
pollSchema.pre('save', function(next) {
  if (!this.challenge && !this.group) {
    return next(new Error('Un sondage doit être lié soit à un défi soit à un groupe'));
  }
  if (this.challenge && this.group) {
    return next(new Error('Un sondage ne peut pas être lié à la fois à un défi et à un groupe'));
  }
  next();
});

module.exports = mongoose.model("Poll", pollSchema);
