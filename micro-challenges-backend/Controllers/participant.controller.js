const Participant = require("../Models/Participant");
const Challenge = require("../Models/Challenge");
const Group = require("../Models/Group");

exports.joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const userId = req.user.id;

    // Vérifier si le défi existe
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ msg: "Défi introuvable" });
    }

    // Vérifier si le participant existe déjà
    const existing = await Participant.findOne({ user: userId, challenge: challengeId });
    if (existing) {
      return res.status(200).json({ msg: "Déjà inscrit à ce défi" });
    }

    // Créer un nouveau participant
    const participant = await Participant.create({
      user: userId,
      challenge: challengeId
    });

    //  GESTION DU GROUPE DE DISCUSSION
    let group = await Group.findOne({ challenge: challengeId });

    if (!group) {
      // Créer le groupe s’il n’existe pas encore
      group = await Group.create({
        name: `Groupe du défi : ${challenge.title}`,
        challenge: challengeId,
        members: [userId]
      });
    } else if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
    }

    //  Réponse finale
    res.status(201).json({
      msg: "Défi rejoint avec succès. Groupe mis à jour.",
      participant,
      groupId: group._id
    });

  } catch (err) {
    console.error("Erreur joinChallenge:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
