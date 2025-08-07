const Proof = require("../Models/Proof");
const Reward = require("../Models/Reward");
const Participant = require("../Models/Participant");
const Notification = require("../Models/Notification");

exports.submitProof = async (req, res) => {
  try {
    const { comment } = req.body;
    const challenge = req.params.challengeId;
    const trimmedChallenge = challenge?.trim();
    const trimmedComment = comment?.trim();
    const fileUrl = req.file ? req.file.path : null;

    //  Vérification : au moins un contenu
    if (!trimmedComment && !fileUrl) {
      return res.status(400).json({
        error: "Vous devez fournir au moins un commentaire ou un fichier (image/vidéo)."
      });
    }

    //  Enregistrement
    const proof = new Proof({
      user: req.user.id,
      challenge,
      comment,
      fileUrl
    });

    await proof.save();
    res.status(201).json({ message: "Preuve envoyée avec succès", proof });

  } catch (err) {
    console.error("Erreur preuve :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getProofsForChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const proofs = await Proof.find({ challenge: challengeId }).populate("user", "username");
    res.status(200).json(proofs);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.validateProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    const { status } = req.body; // "validée" ou "refusée"

    const proof = await Proof.findByIdAndUpdate(proofId, { status }, { new: true });

    if (!proof) {
      return res.status(404).json({ message: "Preuve introuvable" });
    }

    // Si la preuve est validée, accorder récompense + score
    if (status === "validée") {
      // Créer la récompense
      await Reward.create({
        user: proof.user,
        challenge: proof.challenge,
        badge: "Participation Validée",
        points: 10
      });
      // Notification
  await Notification.create({
    user: proof.user,
    title: "🎉 Récompense gagnée !",
    message: "Ta participation a été validée ! Tu as reçu 10 points.",
  });
      // Mettre à jour le participant
      await Participant.findOneAndUpdate(
        { user: proof.user, challenge: proof.challenge },
        { $inc: { score: 10 }, status: "confirmé" }
      );
    }

    res.status(200).json({ message: "Preuve mise à jour", proof });

  } catch (err) {
    console.error("Erreur validation preuve:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

exports.getUserRewards = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rewards = await Reward.find({ user: userId });
    res.status(200).json(rewards);
  } catch (err) {
    console.error("Erreur getUserRewards:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
