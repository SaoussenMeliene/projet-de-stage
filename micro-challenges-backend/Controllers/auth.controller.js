const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, bio, role } = req.body;

    // Vérifier champs obligatoires
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Tous les champs sont requis." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Vérifie s'il existe déjà un utilisateur avec cet email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email déjà utilisé." });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gérer l'image de profil si uploadée
    let profileImagePath = null;
    if (req.file) {
      profileImagePath = `/uploads/profiles/${req.file.filename}`;
    }

    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      bio,
      profileImage: profileImagePath,
      role
    });

    await user.save();

    res.status(201).json({ msg: "Utilisateur enregistré avec succès." });
  } catch (err) {
    console.error("Erreur register:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Tentative de connexion:', { email, password: '***' });

    if (!email || !password) {
      console.log('❌ Champs manquants');
      return res.status(400).json({ msg: "Email et mot de passe requis." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé:', email);
      return res.status(400).json({ msg: "Identifiants invalides." });
    }

    console.log('👤 Utilisateur trouvé:', {
      id: user._id,
      email: user.email,
      role: user.role,
      hasPassword: !!user.password
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Mot de passe incorrect');
      return res.status(400).json({ msg: "Identifiants invalides." });
    }

    console.log('✅ Mot de passe correct');

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log('🎫 Token généré pour:', user.email);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        bio: user.bio,
        profileImage: user.profileImage,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};





exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email requis." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Aucun utilisateur trouvé avec cet email." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    console.log(`Token de réinitialisation généré pour ${email}: ${resetToken}`);

    res.json({
      msg: "Token de réinitialisation généré avec succès.",
      resetToken,
      resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`
    });
  } catch (err) {
    console.error("Erreur forgotPassword:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token et nouveau mot de passe requis." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: "Token invalide ou expiré." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: "Mot de passe réinitialisé avec succès." });
  } catch (err) {
    console.error("Erreur resetPassword:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    res.json({ user });
  } catch (err) {
    console.error("Erreur getProfile:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio } = req.body;
    const userId = req.user.userId;

    let updateData = { firstName, lastName, phone, bio };

    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    res.json({
      msg: "Profil mis à jour avec succès.",
      user
    });
  } catch (err) {
    console.error("Erreur updateProfile:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    console.error("Erreur getAllUsers:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    res.json({ msg: "Utilisateur supprimé avec succès." });
  } catch (err) {
    console.error("Erreur deleteUser:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['admin', 'collaborateur'].includes(role)) {
      return res.status(400).json({ msg: "Rôle invalide." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    res.json({
      msg: "Rôle utilisateur mis à jour avec succès.",
      user
    });
  } catch (err) {
    console.error("Erreur updateUserRole:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ msg: "Username invalide." });
    }
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ msg: "Nom d'utilisateur déjà pris" });
    return res.json({ available: true });
  } catch (err) {
    console.error("Erreur checkUsername:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};

exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) return res.status(400).json({ msg: "Email invalide." });
    const exists = await User.findOne({ email: (email || "").toLowerCase() });
    if (exists) return res.status(409).json({ msg: "Email déjà utilisé" });
    return res.json({ available: true });
  } catch (err) {
    console.error("Erreur checkEmail:", err);
    res.status(500).json({ msg: "Erreur serveur." });
  }
};



