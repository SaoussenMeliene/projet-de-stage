const express = require('express');
const router = express.Router();
const RewardItem = require('../models/RewardItem');
const RewardClaim = require('../models/RewardClaim');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

// GET /api/rewards - Récupérer toutes les récompenses disponibles
router.get('/', verifyToken, async (req, res) => {
  try {
    const rewards = await RewardItem.find({ isActive: true })
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    res.json({ rewards });
  } catch (error) {
    console.error('Erreur récupération récompenses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/rewards - Créer une nouvelle récompense (admin seulement)
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, category, pointsCost, image, stock } = req.body;

    if (!title || !category || !pointsCost) {
      return res.status(400).json({ message: 'Titre, catégorie et coût en points requis' });
    }

    const reward = await RewardItem.create({
      title,
      description,
      category,
      pointsCost: Number(pointsCost),
      image,
      stock: stock ? Number(stock) : -1,
      createdBy: req.user.userId
    });

    await reward.populate('createdBy', 'firstName lastName');

    res.status(201).json({ reward });
  } catch (error) {
    console.error('Erreur création récompense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/rewards/:id/claim - Échanger une récompense
router.post('/:id/claim', verifyToken, async (req, res) => {
  try {
    const rewardId = req.params.id;
    const userId = req.user.userId;

    // Vérifier si la récompense existe
    const reward = await RewardItem.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Récompense non trouvée' });
    }

    if (!reward.isActive) {
      return res.status(400).json({ message: 'Récompense non disponible' });
    }

    // Vérifier le stock
    if (reward.stock !== -1 && reward.claimedBy.length >= reward.stock) {
      return res.status(400).json({ message: 'Stock épuisé' });
    }

    // Vérifier les points de l'utilisateur
    const user = await User.findById(userId);
    if (user.points < reward.pointsCost) {
      return res.status(400).json({ 
        message: `Points insuffisants. Vous avez ${user.points} points, il faut ${reward.pointsCost} points.`
      });
    }

    // Créer la demande d'échange
    const claim = await RewardClaim.create({
      user: userId,
      rewardItem: rewardId,
      pointsSpent: reward.pointsCost
    });

    // Déduire les points de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $inc: { points: -reward.pointsCost }
    });

    // Ajouter l'utilisateur à la liste des réclamations
    await RewardItem.findByIdAndUpdate(rewardId, {
      $push: { claimedBy: { user: userId } }
    });

    const populatedClaim = await RewardClaim.findById(claim._id)
      .populate('rewardItem', 'title category pointsCost')
      .populate('user', 'firstName lastName username');

    res.status(201).json({ 
      message: 'Récompense échangée avec succès !',
      claim: populatedClaim 
    });

  } catch (error) {
    console.error('Erreur échange récompense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/rewards/my-claims - Récupérer les échanges de l'utilisateur
router.get('/my-claims', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const claims = await RewardClaim.find({ user: userId })
      .populate('rewardItem', 'title category pointsCost image')
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    console.error('Erreur récupération mes échanges:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/rewards/admin/claims - Récupérer toutes les demandes (admin)
router.get('/admin/claims', verifyToken, requireAdmin, async (req, res) => {
  try {
    const claims = await RewardClaim.find()
      .populate('user', 'firstName lastName username email')
      .populate('rewardItem', 'title category pointsCost')
      .populate('approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ claims });
  } catch (error) {
    console.error('Erreur récupération demandes admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/rewards/admin/claims/:id - Approuver/rejeter une demande (admin)
router.put('/admin/claims/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const claimId = req.params.id;

    if (!['approved', 'rejected', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Status invalide' });
    }

    const updateData = {
      status,
      adminNotes: adminNotes || '',
      approvedBy: req.user.userId,
      approvedAt: new Date()
    };

    const claim = await RewardClaim.findByIdAndUpdate(claimId, updateData, { new: true })
      .populate('user', 'firstName lastName username email')
      .populate('rewardItem', 'title category pointsCost');

    res.json({ 
      message: `Demande ${status === 'approved' ? 'approuvée' : status === 'rejected' ? 'rejetée' : 'marquée comme livrée'}`,
      claim 
    });

  } catch (error) {
    console.error('Erreur mise à jour demande:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;