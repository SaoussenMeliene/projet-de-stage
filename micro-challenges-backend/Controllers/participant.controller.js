const Participant = require("../Models/Participant");
const Challenge = require("../Models/Challenge");
const Group = require("../Models/Group");
const Proof = require("../Models/Proof");

exports.joinChallenge = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const userId = req.user.userId;

    console.log(`🎯 Tentative de rejoindre le défi ${challengeId} par l'utilisateur ${userId}`);

    // Vérifier si le défi existe
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ msg: "Défi introuvable" });
    }

    // Vérifier si le participant existe déjà
    const existing = await Participant.findOne({ user: userId, challenge: challengeId });
    if (existing) {
      console.log(`ℹ️ L'utilisateur ${userId} est déjà inscrit au défi ${challengeId}`);
      
      // Même si déjà inscrit, vérifier le groupe
      let group = await Group.findOne({ challenge: challengeId });
      if (group && !group.members.some(memberId => memberId.toString() === userId.toString())) {
        console.log(`👥 Ajout de l'utilisateur au groupe existant (était inscrit mais pas dans le groupe)`);
        group.members.push(userId);
        await group.save();
      }
      
      return res.status(200).json({ 
        msg: "Déjà inscrit à ce défi",
        groupId: group?._id 
      });
    }

    // Créer un nouveau participant
    console.log(`📝 Création d'un nouveau participant pour le défi ${challenge.title}`);
    const participant = await Participant.create({
      user: userId,
      challenge: challengeId,
      status: 'en attente' // En attente jusqu'à soumission et validation de preuve
    });

    //  GESTION DU GROUPE DE DISCUSSION
    console.log(`🔍 Recherche du groupe pour le défi ${challengeId}`);
    let group = await Group.findOne({ challenge: challengeId });

    if (!group) {
      // Créer le groupe s'il n'existe pas encore
      console.log(`📝 Création d'un nouveau groupe pour le défi: ${challenge.title}`);
      group = await Group.create({
        name: `Groupe du défi : ${challenge.title}`,
        challenge: challengeId,
        members: [userId],
        description: `Groupe de discussion pour le défi "${challenge.title}"`
      });
      console.log(`✅ Groupe créé avec l'ID: ${group._id}`);
    } else {
      // Vérifier si l'utilisateur est déjà membre
      const isMember = group.members.some(memberId => memberId.toString() === userId.toString());
      if (!isMember) {
        console.log(`👥 Ajout de l'utilisateur ${userId} au groupe existant ${group._id}`);
        group.members.push(userId);
        await group.save();
        console.log(`✅ Utilisateur ajouté au groupe. Nombre total de membres: ${group.members.length}`);
      } else {
        console.log(`ℹ️ L'utilisateur ${userId} est déjà membre du groupe ${group._id}`);
      }
    }

    //  Réponse finale
    console.log(`🎉 Défi rejoint avec succès! Participant: ${participant._id}, Groupe: ${group._id}`);
    res.status(201).json({
      msg: "Défi rejoint avec succès. Vous avez été ajouté au groupe de discussion. N'oubliez pas de soumettre une preuve pour valider votre participation !",
      participant,
      groupId: group._id,
      groupName: group.name,
      needsProof: true // Indique qu'une preuve est requise
    });

  } catch (err) {
    console.error("❌ Erreur joinChallenge:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Fonction pour quitter un défi
exports.leaveChallenge = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;
    const userId = req.user.userId;

    console.log(`🚪 Tentative de quitter le défi ${challengeId} par l'utilisateur ${userId}`);

    // Supprimer la participation
    const participant = await Participant.findOneAndDelete({ 
      user: userId, 
      challenge: challengeId 
    });

    if (!participant) {
      return res.status(404).json({ msg: "Participation introuvable" });
    }

    // Supprimer les preuves associées à cette participation
    try {
      await Proof.deleteMany({ participant: participant._id });
      console.log(`🗑️ Preuves supprimées pour le participant ${participant._id}`);
    } catch (e) {
      console.warn(`⚠️ Impossible de supprimer les preuves du participant ${participant._id}:`, e.message);
    }

    // Retirer l'utilisateur du groupe de discussion
    const group = await Group.findOne({ challenge: challengeId });
    if (group) {
      const memberIndex = group.members.findIndex(memberId => memberId.toString() === userId.toString());
      if (memberIndex > -1) {
        group.members.splice(memberIndex, 1);
        await group.save();
        console.log(`👥 Utilisateur retiré du groupe. Membres restants: ${group.members.length}`);
      }
    }

    console.log(`✅ Défi quitté avec succès`);
    res.status(200).json({
      msg: "Défi quitté avec succès. Vous avez été retiré du groupe de discussion."
    });

  } catch (err) {
    console.error("❌ Erreur leaveChallenge:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Obtenir les participants d'un défi
exports.getChallengeParticipants = async (req, res) => {
  try {
    const challengeId = req.params.challengeId;

    const participants = await Participant.find({ challenge: challengeId })
      .populate('user', 'username email firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      participants,
      count: participants.length
    });

  } catch (err) {
    console.error("❌ Erreur getChallengeParticipants:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};

// Obtenir les défis auxquels un utilisateur participe
exports.getUserParticipations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const participations = await Participant.find({ user: userId })
      .populate('challenge', 'title description category startDate endDate image coverImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      participations,
      count: participations.length
    });

  } catch (err) {
    console.error("❌ Erreur getUserParticipations:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};