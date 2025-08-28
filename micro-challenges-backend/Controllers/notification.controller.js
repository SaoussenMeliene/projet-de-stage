
const Notification = require("../Models/Notification");

//  Liste des notifications d’un utilisateur
exports.getUserNotifications = async (req, res) => {
  try {
    console.log('🔔 Récupération des notifications pour userId:', req.user.userId);
    const notifications = await Notification.find({ user: req.user.userId }).sort({ createdAt: -1 });
    console.log('🔔 Notifications trouvées:', notifications.length);
    res.status(200).json(notifications);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des notifications:', err);
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

// Créer une notification de test
exports.createTestNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      user: req.user.userId,
      title: "Test notification",
      message: "Ceci est une notification de test pour vérifier le système",
      isRead: false
    });
    
    await newNotification.save();
    console.log('✅ Notification de test créée pour userId:', req.user.userId);
    res.status(201).json(newNotification);
  } catch (err) {
    console.error('❌ Erreur lors de la création de la notification de test:', err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
