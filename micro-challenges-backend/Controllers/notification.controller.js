
const Notification = require("../Models/Notification");

//  Liste des notifications d’un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ msg: "Notification marquée comme lue" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
