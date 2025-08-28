const express = require("express");
const router = express.Router();
const userRewardCtrl = require("../Controllers/userReward.controller");
const verifyToken = require("../Middleware/auth");

// POST: Échanger une récompense contre des points
router.post("/claim", verifyToken, userRewardCtrl.claimReward);

// GET: Récupérer les récompenses échangées par l'utilisateur connecté
router.get("/my-claimed", verifyToken, userRewardCtrl.getUserClaimedRewards);

// DELETE: Supprimer une récompense échangée (admin)
router.delete("/:rewardId", verifyToken, userRewardCtrl.deleteClaimedReward);

module.exports = router;