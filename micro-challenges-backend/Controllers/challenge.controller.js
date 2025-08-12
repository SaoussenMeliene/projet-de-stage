const Challenge = require("../Models/Challenge");
const User = require("../Models/User");
const Notification = require("../Models/Notification");

// GET: Tous les défis
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().populate("createdBy", "username");
    res.status(200).json(challenges);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// POST: Créer un défi (admin)
exports.createChallenge = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate } = req.body;
    const createdBy = req.user.id;

    const newChallenge = new Challenge({ title, description, category, startDate, endDate, createdBy });
    await newChallenge.save();

    //  Notifications aux collaborateurs
    const collaborateurs = await User.find({ role: "collaborateur" });
    const notifications = collaborateurs.map(user => ({
      user: user._id,
      title: "Nouveau défi disponible",
      message: `Le défi "${newChallenge.title}" est en ligne !`
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ msg: "Défi créé avec succès", challenge: newChallenge });
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
// rejoindre un défi 
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ msg: "Défi introuvable" });

    // Pas besoin de faire plus que marquer sa participation si besoin
    if (challenge.participants.includes(req.user.id)) {
      return res.status(200).json({ msg: "Déjà membre de ce défi" });
    }

    challenge.participants.push(req.user.id);
    await challenge.save();

    res.status(200).json({ msg: "Défi rejoint avec succès" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
