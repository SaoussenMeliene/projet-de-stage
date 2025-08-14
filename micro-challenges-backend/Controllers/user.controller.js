const User = require("../Models/User");

// Rechercher des utilisateurs (pour les ajouter aux groupes)
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user.userId;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ msg: "La recherche doit contenir au moins 2 caractères" });
    }

    // Recherche par nom d'utilisateur ou email (excluant l'utilisateur actuel)
    const users = await User.find({
      _id: { $ne: currentUserId },
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username email role')
    .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur searchUsers:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Récupérer tous les utilisateurs (admin seulement)
exports.getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: "Accès refusé - Admin requis" });
    }

    const users = await User.find()
      .select('username email role createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur getAllUsers:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Récupérer le profil de l'utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur introuvable" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erreur getUserProfile:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Mettre à jour le profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, firstName, lastName, phone, bio } = req.body;
    const userId = req.user.userId;

    console.log("📝 Mise à jour du profil pour:", userId);
    console.log("📝 Données reçues:", { username, email, firstName, lastName, phone, bio });

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({ msg: "Cet email est déjà utilisé" });
      }
    }

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;

    console.log("📝 Données à mettre à jour:", updateData);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    console.log("✅ Profil mis à jour:", updatedUser);

    // Mettre à jour aussi le localStorage côté client
    res.status(200).json({
      msg: "Profil mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    console.error("Erreur updateUserProfile:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};
