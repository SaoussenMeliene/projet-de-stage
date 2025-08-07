
const RewardCatalog = require("../Models/RewardCatalog");

//  Ajouter une récompense
exports.addReward = async (req, res) => {
  try {
    const { name, description, stock, pointsRequired } = req.body;
    const reward = new RewardCatalog({ name, description, stock, pointsRequired });
    await reward.save();
    res.status(201).json({ msg: "Récompense ajoutée", reward });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

//  Voir toutes les récompenses
exports.getAllRewards = async (req, res) => {
  try {
    const rewards = await RewardCatalog.find();
    res.status(200).json(rewards);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//  Supprimer une récompense
exports.deleteReward = async (req, res) => {
  try {
    await RewardCatalog.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Récompense supprimée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

//  Mettre à jour une récompense 
exports.updateReward = async (req, res) => {
  try {
    const reward = await RewardCatalog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ msg: "Récompense mise à jour", reward });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
