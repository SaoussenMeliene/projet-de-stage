// Models/Challenge.js (CommonJS)
const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    // stocke un slug propre: 'ecologique', 'sportif', etc.
    category: {
      type: String,
      enum: ['solidaire', 'ecologique', 'creatif', 'sportif', 'educatif'],
      required: true,
    },
    tags: [{ type: String }],

    // pour compat : certains docs anciens ont startDate/endDate
    startAt: { type: Date },
    endAt: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },

    participantsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    progressAvg: { type: Number, default: 0 },
    coverImage: { type: String, default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// index texte pour la recherche titre/description/tags
ChallengeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Challenge', ChallengeSchema);
