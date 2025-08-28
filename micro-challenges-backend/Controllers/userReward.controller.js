const UserReward = require("../Models/UserReward");
const User = require("../Models/User");
const Participant = require("../models/Participant");
const mongoose = require("mongoose");

// Échanger une récompense contre des points
exports.claimReward = async (req, res) => {
  try {
    const { rewardId, rewardName, rewardDescription, pointsRequired } = req.body;
    
    if (!req.user) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }
    
    const userId = req.user.userId;

    // Calculer les points totaux de l'utilisateur - Convertir en ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    
    const userParticipations = await Participant.find({ user: userObjectId });
    
    let totalPoints = 0;
    
    userParticipations.forEach(p => {
      if (p.status === 'confirmé') {
        const basePoints = 100; // Points de base par défi terminé
        const bonusPoints = p.score > 80 ? 50 : p.score > 60 ? 25 : 0;
        totalPoints += basePoints + bonusPoints;
      } else if (p.status === 'en attente') {
        totalPoints += 25; // Points partiels
      }
    });

    // Vérifier que l'utilisateur a assez de points
    if (totalPoints < pointsRequired) {
      return res.status(400).json({ 
        error: "Points insuffisants", 
        message: `Vous avez ${totalPoints} points, mais ${pointsRequired} sont requis.` 
      });
    }

    // NOTE: Suppression de la vérification de double échange
    // Les collaborateurs peuvent maintenant échanger plusieurs fois la même récompense
    // Cette modification permet une plus grande flexibilité dans l'utilisation des points
    // Créer l'enregistrement d'échange
    const newUserReward = new UserReward({
      userId,
      rewardName,
      rewardDescription,
      pointsSpent: pointsRequired,
      rewardId,
      status: 'claimed'
    });

    await newUserReward.save();

    res.status(201).json({
      success: true,
      message: `🎉 Félicitations ! Vous avez échangé "${rewardName}" pour ${pointsRequired} points !`,
      reward: newUserReward,
      remainingPoints: totalPoints - pointsRequired
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'échange de la récompense:', error);
    res.status(500).json({ 
      error: "Erreur serveur", 
      message: "Impossible d'échanger la récompense pour le moment."
    });
  }
};

// Récupérer les récompenses échangées par un utilisateur
exports.getUserClaimedRewards = async (req, res) => {
  try {
    const userId = req.user.id;

    const claimedRewards = await UserReward.find({ userId })
      .sort({ exchangedAt: -1 }); // Plus récent d'abord

    console.log(`📋 ${claimedRewards.length} récompenses échangées récupérées pour l'utilisateur ${userId}`);

    res.status(200).json({
      success: true,
      claimedRewards: claimedRewards
    });

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des récompenses échangées:', error);
    res.status(500).json({ 
      error: "Erreur serveur", 
      claimedRewards: []
    });
  }
};

// Supprimer une récompense échangée (admin uniquement)
exports.deleteClaimedReward = async (req, res) => {
  try {
    const { rewardId } = req.params;

    await UserReward.findByIdAndDelete(rewardId);

    res.status(200).json({
      success: true,
      message: "Récompense échangée supprimée avec succès"
    });

  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la récompense échangée:', error);
    res.status(500).json({ 
      error: "Erreur serveur" 
    });
  }
};