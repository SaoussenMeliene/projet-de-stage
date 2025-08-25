const Group = require("../Models/Group");
const User = require("../Models/User");
const Challenge = require("../Models/Challenge");
const Participant = require("../Models/Participant");
const Proof = require("../Models/Proof");

// Récupérer tous les groupes de l'utilisateur connecté
exports.getUserGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const groups = await Group.find({ members: userId })
      .populate('challenge', 'title description category')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    // Calculer les statistiques pour chaque groupe
    const groupsWithStats = await Promise.all(groups.map(async (group) => {
      const participants = await Participant.find({ challenge: group.challenge._id });
      const totalPoints = participants.reduce((sum, p) => sum + p.score, 0);
      
      return {
        ...group.toObject(),
        stats: {
          totalMembers: group.members.length,
          totalPoints,
          activeParticipants: participants.filter(p => p.status === 'confirmé').length
        }
      };
    }));

    res.status(200).json(groupsWithStats);
  } catch (error) {
    console.error("Erreur getUserGroups:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Récupérer les détails d'un groupe spécifique
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId)
      .populate('challenge', 'title description category startDate endDate')
      .populate('members', 'username email role');

    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Vérifier que l'utilisateur est membre du groupe OU admin
    const currentUser = await User.findById(userId);
    const isMember = group.members.some(member => member._id.toString() === userId);
    const isAdmin = currentUser.role === 'admin';
    
    if (!isMember && !isAdmin) {
      return res.status(403).json({ msg: "Accès refusé à ce groupe" });
    }

    // Récupérer les statistiques détaillées
    const participants = await Participant.find({ challenge: group.challenge._id })
      .populate('user', 'username email');

    const stats = {
      totalMembers: group.members.length,
      totalPoints: participants.reduce((sum, p) => sum + p.score, 0),
      activeParticipants: participants.filter(p => p.status === 'confirmé').length,
      averageScore: participants.length > 0 ? 
        participants.reduce((sum, p) => sum + p.score, 0) / participants.length : 0
    };

    res.status(200).json({
      ...group.toObject(),
      stats,
      participants
    });
  } catch (error) {
    console.error("Erreur getGroupDetails:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Créer un nouveau groupe (admin seulement)
exports.createGroup = async (req, res) => {
  try {
    const { name, challengeId, description } = req.body;
    const userId = req.user.userId;

    // Vérifier que l'utilisateur est admin
    const user = await User.findById(userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: "Seuls les admins peuvent créer des groupes" });
    }

    // Vérifier que le défi existe
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ msg: "Défi introuvable" });
    }

    // Vérifier qu'un groupe n'existe pas déjà pour ce défi
    const existingGroup = await Group.findOne({ challenge: challengeId });
    if (existingGroup) {
      return res.status(400).json({ msg: "Un groupe existe déjà pour ce défi" });
    }

    const group = await Group.create({
      name: name || `Groupe du défi : ${challenge.title}`,
      challenge: challengeId,
      members: [userId],
      description
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('challenge', 'title description category')
      .populate('members', 'username email');

    res.status(201).json({
      msg: "Groupe créé avec succès",
      group: populatedGroup
    });
  } catch (error) {
    console.error("Erreur createGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Ajouter un membre au groupe (admin seulement)
exports.addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const newMemberId = userId;
    const adminId = req.user.userId;

    console.log('=== AddMemberToGroup ===');
    console.log('GroupId:', groupId);
    console.log('UserId à ajouter:', newMemberId);
    console.log('Admin:', adminId);

    // Valider les données
    if (!newMemberId) {
      return res.status(400).json({ msg: "ID utilisateur requis" });
    }

    // Vérifier que l'utilisateur est admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ msg: "Seuls les admins peuvent ajouter des membres" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Vérifier que l'utilisateur à ajouter existe
    const newMember = await User.findById(newMemberId);
    if (!newMember) {
      return res.status(404).json({ msg: "Utilisateur introuvable" });
    }

    // Vérifier que l'utilisateur n'est pas déjà membre
    if (group.members.includes(newMemberId)) {
      return res.status(400).json({ msg: "L'utilisateur est déjà membre du groupe" });
    }

    // Ajouter le membre
    group.members.push(newMemberId);
    await group.save();

    // Ajouter automatiquement l'utilisateur au défi associé
    const existingParticipant = await Participant.findOne({ 
      user: newMemberId, 
      challenge: group.challenge 
    });

    if (!existingParticipant) {
      await Participant.create({
        user: newMemberId,
        challenge: group.challenge,
        status: 'confirmé'
      });
    }

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'username email');

    res.status(200).json({
      msg: "Membre ajouté avec succès",
      group: updatedGroup
    });
  } catch (error) {
    console.error("Erreur addMemberToGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Supprimer un membre du groupe (admin seulement)
exports.removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, userId: memberToRemove } = req.params;
    const adminId = req.user.userId;

    // Vérifier que l'utilisateur est admin
    const admin = await User.findById(adminId);
    if (admin.role !== 'admin') {
      return res.status(403).json({ msg: "Seuls les admins peuvent supprimer des membres" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Vérifier que l'utilisateur est membre du groupe
    if (!group.members.includes(memberToRemove)) {
      return res.status(400).json({ msg: "L'utilisateur n'est pas membre du groupe" });
    }

    // Supprimer le membre
    group.members = group.members.filter(member => member.toString() !== memberToRemove);
    await group.save();

    // Optionnel : supprimer aussi sa participation au défi
    await Participant.findOneAndDelete({ 
      user: memberToRemove, 
      challenge: group.challenge 
    });

    const updatedGroup = await Group.findById(groupId)
      .populate('members', 'username email');

    res.status(200).json({
      msg: "Membre supprimé avec succès",
      group: updatedGroup
    });
  } catch (error) {
    console.error("Erreur removeMemberFromGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Quitter un groupe
exports.leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Vérifier que l'utilisateur est membre du groupe
    if (!group.members.some(member => member.toString() === userId.toString())) {
      return res.status(400).json({ msg: "Vous n'êtes pas membre de ce groupe" });
    }

    // Supprimer l'utilisateur du groupe
    group.members = group.members.filter(member => member.toString() !== userId.toString());
    await group.save();

    // Supprimer sa participation au défi
    const participant = await Participant.findOneAndDelete({ 
      user: userId, 
      challenge: group.challenge 
    });

    // Supprimer aussi les preuves liées à cette participation
    if (participant) {
      try {
        await Proof.deleteMany({ participant: participant._id });
        console.log(`🗑️ Preuves supprimées pour le participant ${participant._id}`);
      } catch (e) {
        console.warn(`⚠️ Impossible de supprimer les preuves du participant ${participant._id}:`, e.message);
      }
    }

    res.status(200).json({
      msg: "Vous avez quitté le groupe avec succès"
    });
  } catch (error) {
    console.error("Erreur leaveGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Récupérer les statistiques d'un groupe
exports.getGroupStats = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Vérifier que l'utilisateur est membre du groupe
    if (!group.members.includes(userId)) {
      return res.status(403).json({ msg: "Accès refusé à ce groupe" });
    }

    const participants = await Participant.find({ challenge: group.challenge })
      .populate('user', 'username email');

    const stats = {
      totalMembers: group.members.length,
      totalPoints: participants.reduce((sum, p) => sum + p.score, 0),
      activeParticipants: participants.filter(p => p.status === 'confirmé').length,
      averageScore: participants.length > 0 ? 
        participants.reduce((sum, p) => sum + p.score, 0) / participants.length : 0,
      topPerformers: participants
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(p => ({
          username: p.user.username,
          score: p.score
        }))
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur getGroupStats:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Récupérer tous les groupes (admin seulement)
exports.getAllGroups = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Vérifier que l'utilisateur est admin
    const currentUser = await User.findById(userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: "Accès refusé - Admin requis" });
    }

    console.log(`=== GetAllGroups Admin ===`);
    console.log(`Admin: ${currentUser.email}`);

    const groups = await Group.find()
      .populate('challenge', 'title description category startDate endDate')
      .populate('members', 'username email firstName lastName')
      .sort({ createdAt: -1 });

    // Calculer les statistiques pour chaque groupe
    const groupsWithStats = await Promise.all(groups.map(async (group) => {
      const participants = await Participant.find({ challenge: group.challenge?._id });
      const totalPoints = participants.reduce((sum, p) => sum + p.score, 0);
      
      return {
        id: group._id,
        name: group.name,
        description: group.description,
        challenge: group.challenge,
        members: group.members,
        createdAt: group.createdAt,
        status: group.status || 'actif',
        stats: {
          totalMembers: group.members.length,
          totalPoints,
          activeParticipants: participants.filter(p => p.status === 'confirmé').length,
          averageScore: participants.length > 0 ? 
            Math.round(totalPoints / participants.length) : 0
        }
      };
    }));

    console.log(`✅ ${groupsWithStats.length} groupes récupérés`);

    res.status(200).json(groupsWithStats);
  } catch (error) {
    console.error("Erreur getAllGroups:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Modifier un groupe (admin seulement)
exports.updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, status } = req.body;
    const userId = req.user.userId;
    
    // Vérifier que l'utilisateur est admin
    const currentUser = await User.findById(userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: "Accès refusé - Admin requis" });
    }

    console.log(`=== UpdateGroup Admin ===`);
    console.log(`Admin: ${currentUser.email}`);
    console.log(`Groupe à modifier: ${groupId}`);

    // Vérifier que le groupe existe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Valider les données
    if (!name || !name.trim()) {
      return res.status(400).json({ msg: "Le nom du groupe est requis" });
    }

    // Mettre à jour le groupe
    const updateData = {
      name: name.trim(),
      description: description ? description.trim() : (group.description || ''),
      status: status || group.status || 'actif'
    };

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId, 
      updateData, 
      { new: true }
    ).populate('challenge', 'title description category')
     .populate('members', 'username email firstName lastName');

    console.log(`✅ Groupe "${updatedGroup.name}" modifié avec succès`);

    res.status(200).json({ 
      msg: "Groupe modifié avec succès", 
      group: {
        id: updatedGroup._id,
        name: updatedGroup.name,
        description: updatedGroup.description,
        status: updatedGroup.status,
        challenge: updatedGroup.challenge,
        members: updatedGroup.members,
        createdAt: updatedGroup.createdAt
      }
    });
  } catch (error) {
    console.error("Erreur updateGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};

// Supprimer un groupe (admin seulement)
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    
    // Vérifier que l'utilisateur est admin
    const currentUser = await User.findById(userId);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ msg: "Accès refusé - Admin requis" });
    }

    console.log(`=== DeleteGroup Admin ===`);
    console.log(`Admin: ${currentUser.email}`);
    console.log(`Groupe à supprimer: ${groupId}`);

    // Vérifier que le groupe existe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ msg: "Groupe introuvable" });
    }

    // Supprimer le groupe
    await Group.findByIdAndDelete(groupId);

    console.log(`✅ Groupe "${group.name}" supprimé avec succès`);

    res.status(200).json({ 
      msg: "Groupe supprimé avec succès", 
      deletedGroup: {
        id: group._id,
        name: group.name
      }
    });
  } catch (error) {
    console.error("Erreur deleteGroup:", error);
    res.status(500).json({ msg: "Erreur serveur", error: error.message });
  }
};
