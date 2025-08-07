// routes/rewardCatalog.routes.js
const express = require("express");
const router = express.Router();
const rewardCatalogCtrl = require("../Controllers/rewardCatalog.controller");
const verifyToken = require("../Middleware/auth"); // ou ton middleware d’authentification

// GET: Tous les éléments de la boutique
router.get("/", verifyToken, rewardCatalogCtrl.getAllRewards);

// POST: Ajouter une récompense (admin)
router.post("/", verifyToken, rewardCatalogCtrl.addReward);

// DELETE: Supprimer
router.delete("/:id", verifyToken, rewardCatalogCtrl.deleteReward);

// PUT: Modifier une récompense
router.put("/:id", verifyToken, rewardCatalogCtrl.updateReward);

module.exports = router;
