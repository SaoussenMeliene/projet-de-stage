import { api } from '../lib/axios';

export const notificationService = {
  // Obtenir les notifications de l'utilisateur connecté
  async getMyNotifications() {
    try {
      const data = await api.get('/notifications');
      return { data }; // Wrap dans un objet pour maintenir la compatibilité
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    try {
      const data = await api.patch(`/notifications/${notificationId}/read`);
      return { data }; // Wrap dans un objet pour maintenir la compatibilité
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
      throw error;
    }
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead() {
    try {
      const notifications = await this.getMyNotifications();
      const unreadNotifications = notifications.data.filter(n => !n.isRead);
      
      const promises = unreadNotifications.map(notification => 
        this.markAsRead(notification._id)
      );
      
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  },

  // Obtenir le nombre de notifications non lues
  async getUnreadCount() {
    try {
      const response = await this.getMyNotifications();
      const unreadCount = response.data.filter(n => !n.isRead).length;
      return unreadCount;
    } catch (error) {
      console.error('Erreur lors du comptage des notifications non lues:', error);
      return 0;
    }
  }
};

export default notificationService;