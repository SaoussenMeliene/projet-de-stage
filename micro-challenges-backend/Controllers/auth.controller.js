const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Vérifier champs obligatoires
    if (!username || !email || !password) {
      return res.status(400).json({ msg: "Tous les champs sont requis." });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    // Vérifie s’il existe déjà un utilisateur avec cet email
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
      profileImage: profileImagePath,
      role
    });

    await user.save();

    res.status(201).json({ msg: "Utilisateur enregistré avec succès." });
  } catch (err) {
    console.error("Erreur register:", err);

    // Gestion propre des erreurs de validation mongoose (regex email, etc.)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ msg: messages.join(", ") });
    }

    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    console.log("🔐 Tentative de connexion reçue:", req.body);
    const { email, password, expectedRole } = req.body;

    console.log("🔍 Recherche utilisateur:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Utilisateur non trouvé:", email);
      return res.status(400).json({ msg: "Email incorrect." });
    }
    console.log("✅ Utilisateur trouvé:", user.email, "- Role:", user.role);

    console.log("🔑 Vérification du mot de passe...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(400).json({ msg: "Mot de passe incorrect." });
    }
    console.log("✅ Mot de passe correct pour:", email);

    // Vérification de cohérence du rôle si fourni
    if (expectedRole && user.role !== expectedRole) {
      console.log(`Incohérence de rôle détectée: attendu ${expectedRole}, réel ${user.role}`);
      // On continue quand même mais on log l'incohérence
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Réponse enrichie avec les données utilisateur
    console.log("🎉 Connexion réussie pour:", email, "- Token généré");
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        profileImage: user.profileImage || null
      },
      message: `Connexion réussie en tant que ${user.role}`
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Demande de réinitialisation de mot de passe
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("🔄 Demande de réinitialisation pour:", email);

    const user = await User.findOne({ email });
    if (!user) {
      // Pour des raisons de sécurité, on renvoie toujours le même message
      return res.status(200).json({
        msg: "Si cet email existe, un lien de réinitialisation a été envoyé."
      });
    }

    // Générer un token de réinitialisation
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 heure

    // Sauvegarder le token dans l'utilisateur
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    console.log("✅ Token de réinitialisation généré pour:", email);
    console.log("🔑 Token:", resetToken);

    // En production, vous enverriez un email ici
    // Pour le développement, on renvoie le token dans la réponse
    res.status(200).json({
      msg: "Si cet email existe, un lien de réinitialisation a été envoyé.",
      // ATTENTION: En production, ne jamais renvoyer le token !
      resetToken: resetToken, // Seulement pour le développement
      resetUrl: `http://localhost:5173/reset-password?token=${resetToken}`
    });

  } catch (err) {
    console.error("Erreur forgot password:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Réinitialisation du mot de passe
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log("🔄 Tentative de réinitialisation avec token:", token);

    // Trouver l'utilisateur avec le token valide
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        msg: "Token invalide ou expiré."
      });
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe et supprimer le token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("✅ Mot de passe réinitialisé pour:", user.email);

    res.status(200).json({
      msg: "Mot de passe réinitialisé avec succès."
    });

  } catch (err) {
    console.error("Erreur reset password:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Vérification de la disponibilité du nom d'utilisateur
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;

    console.log("🔍 Vérification du nom d'utilisateur:", username);

    if (!username || username.length < 3) {
      return res.status(400).json({
        msg: "Le nom d'utilisateur doit contenir au moins 3 caractères"
      });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log("❌ Nom d'utilisateur déjà pris:", username);
      return res.status(409).json({
        msg: "Nom d'utilisateur déjà pris"
      });
    }

    console.log("✅ Nom d'utilisateur disponible:", username);
    res.status(200).json({
      msg: "Nom d'utilisateur disponible"
    });

  } catch (err) {
    console.error("Erreur check username:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Vérification de la disponibilité de l'email
exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.params;

    console.log("🔍 Vérification de l'email:", email);

    // Validation du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: "Format d'email invalide"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("❌ Email déjà utilisé:", email);
      return res.status(409).json({
        msg: "Email déjà utilisé"
      });
    }

    console.log("✅ Email disponible:", email);
    res.status(200).json({
      msg: "Email disponible"
    });

  } catch (err) {
    console.error("Erreur check email:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
