const express = require("express");
const router = express.Router();
const userCtrl = require("../Controllers/user.controller");
const verifyToken = require("../Middleware/auth");
const User = require("../Models/User");

// Route existante
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      msg: "Profil utilisateur complet récupéré",
      user
    });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
});

// Nouvelles routes
// GET: Rechercher des utilisateurs
router.get("/search", verifyToken, userCtrl.searchUsers);

// GET: Récupérer tous les utilisateurs (admin seulement)
router.get("/", verifyToken, userCtrl.getAllUsers);

// GET: Récupérer le profil de l'utilisateur connecté
router.get("/profile", verifyToken, userCtrl.getUserProfile);

// PUT: Mettre à jour le profil utilisateur
router.put("/profile", verifyToken, userCtrl.updateUserProfile);

module.exports = router;
