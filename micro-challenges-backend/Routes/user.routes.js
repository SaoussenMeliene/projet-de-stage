const express = require("express");
const router = express.Router();
const userCtrl = require("../Controllers/user.controller");
const verifyToken = require("../Middleware/auth");
const { handleProfileImageUpload } = require("../Middleware/upload");
const User = require("../Models/User");

// Route existante
router.get("/me", verifyToken, async (req, res) => {
  try {
    const u = await User.findById(req.user.userId).select("-password");
    if (!u) return res.status(404).json({ msg: "Utilisateur introuvable" });

    const profileImage = u.profileImage || null; // ex: "/uploads/profiles/xxx.jpg"

    res.json({
      user: {
        id: u._id,
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        profileImage,           // <= important
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      }
    });
  } catch (error) {
    console.error("Erreur /me:", error);
    res.status(500).json({ msg: "Erreur serveur" });
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

// GET: Récupérer les statistiques de l'utilisateur connecté
router.get("/me/stats", verifyToken, userCtrl.getUserStats);




// PUT: Mettre à jour l'image de profil
router.put("/profile-image", verifyToken, handleProfileImageUpload, async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ msg: "Aucune image fournie" });
    }

    // Construire le chemin de l'image
    const profileImagePath = `/uploads/profiles/${req.file.filename}`;

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImagePath },
      { new: true, runValidators: true }
    ).select('-password');

    console.log("✅ Image de profil mise à jour:", profileImagePath);

    res.status(200).json({
      msg: "Image de profil mise à jour avec succès",
      user: updatedUser,
      profileImage: profileImagePath
    });
  } catch (error) {
    console.error("Erreur updateProfileImage:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

// DELETE: Supprimer l'image de profil
router.delete("/profile-image", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const fs = require('fs');
    const path = require('path');

    // Récupérer l'utilisateur actuel pour connaître l'image à supprimer
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur introuvable" });
    }

    // Supprimer le fichier physique s'il existe
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage.replace(/^\//, ''));
      if (fs.existsSync(imagePath)) {
        try {
          fs.unlinkSync(imagePath);
          console.log("✅ Fichier image supprimé:", imagePath);
        } catch (error) {
          console.warn("⚠️ Impossible de supprimer le fichier:", error.message);
        }
      }
    }

    // Mettre à jour l'utilisateur pour retirer l'image de profil
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $unset: { profileImage: 1 } },
      { new: true, runValidators: true }
    ).select('-password');

    console.log("✅ Image de profil supprimée pour l'utilisateur:", userId);

    res.status(200).json({
      msg: "Image de profil supprimée avec succès",
      user: updatedUser
    });
  } catch (error) {
    console.error("Erreur deleteProfileImage:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
});

module.exports = router;
