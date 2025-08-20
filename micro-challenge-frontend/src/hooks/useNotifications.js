import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getMyNotifications();
      const notificationsData = response.data || [];
      
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Erreur lors du chargement des notifications:', err);
      setError(err.message || 'Erreur lors du chargement des notifications');
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Erreur lors du marquage de la notification:', err);
      return false;
    }
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Erreur lors du marquage de toutes les notifications:', err);
      return false;
    }
  }, []);

  // Rafraîchir les notifications
  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Charger les notifications au montage du composant
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadNotifications();
    }
  }, [loadNotifications]);

  // Polling pour vérifier les nouvelles notifications (optionnel)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    loadNotifications
  };
};