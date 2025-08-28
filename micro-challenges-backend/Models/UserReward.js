const mongoose = require('mongoose');

// Modèle pour stocker les récompenses échangées par les utilisateurs
const userRewardSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  rewardName: { 
    type: String, 
    required: true 
  },
  rewardDescription: { 
    type: String, 
    required: true 
  },
  pointsSpent: { 
    type: Number, 
    required: true 
  },
  exchangedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Identifiant de la récompense échangée (échanges multiples autorisés)
  rewardId: { 
    type: String, 
    required: true 
  },
  // Identifiant unique de cet échange spécifique
  exchangeId: { 
    type: String, 
    default: function() {
      return `${this.userId}_${this.rewardId}_${Date.now()}`;
    }
  },
  status: { 
    type: String, 
    enum: ['claimed', 'delivered', 'expired'], 
    default: 'claimed' 
  }
});

module.exports = mongoose.model("UserReward", userRewardSchema);