const Message = require("../Models/Message");
const Group = require("../Models/Group");

// Envoyer un message dans un groupe
exports.sendMessage = async (req, res) => {
  try {
    const { content = "", mediaUrl = "", mediaType = "" } = req.body || {};

    const groupId = req.params.groupId;
    const senderId = req.user.userId;

    // 🔐 Vérifier si l'utilisateur est membre du groupe
    const group = await Group.findById(groupId);
    if (!group || !group.members.includes(senderId)) {
      return res.status(403).json({ msg: "Vous n'êtes pas membre de ce groupe" });
    }

    const message = await Message.create({
      sender: senderId,
      group: groupId,
      content,
      mediaUrl,
      mediaType,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "username profileImage firstName lastName");

    // push en temps réel aux membres du groupe
    try {
      const io = req.app.get('io');
      if (io) io.to(`group:${groupId}`).emit('message:new', { groupId, message: populatedMessage });
    } catch {}

    res.status(201).json({
      message: "Message envoyé avec succès",
      data: populatedMessage,
    });


  } catch (err) {
    console.error("Erreur envoi message:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi du message" });
  }
};

// Obtenir les messages d’un groupe
exports.getMessagesByGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await Group.findById(groupId);

    if (!group || !group.members.includes(req.user.userId)) {
      return res.status(403).json({ msg: "Accès refusé à ce groupe" });
    }

    const messages = await Message.find({ group: groupId })
      .populate("sender", "username profileImage firstName lastName")
      .sort({ createdAt: 1 });
      
    res.status(200).json(messages);

  } catch (err) {
    console.error("Erreur récupération messages:", err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des messages" });
  }
};
