import { api } from '../lib/axios';

export const userService = {
  // Récupérer tous les utilisateurs
  async getUsers() {
    try {
      const response = await api.get('/users');
      return {
        success: true,
        users: response.data || response || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      return {
        success: false,
        users: [],
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Récupérer un utilisateur par ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return {
        success: true,
        user: response.data || response
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement de l\'utilisateur:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        user: response.data || response,
        message: 'Utilisateur mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'utilisateur:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Supprimer un utilisateur
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Changer le rôle d'un utilisateur
  async changeUserRole(userId, newRole) {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role: newRole });
      return {
        success: true,
        user: response.data || response,
        message: 'Rôle mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors du changement de rôle:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Changer le statut d'un utilisateur (activer/désactiver/suspendre)
  async changeUserStatus(userId, newStatus) {
    try {
      const response = await api.patch(`/users/${userId}/status`, { status: newStatus });
      return {
        success: true,
        user: response.data || response,
        message: 'Statut mis à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Inviter un nouvel utilisateur
  async inviteUser(inviteData) {
    try {
      const response = await api.post('/users/invite', inviteData);
      return {
        success: true,
        invitation: response.data || response,
        message: 'Invitation envoyée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'invitation:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Récupérer les statistiques des utilisateurs
  async getUserStats() {
    try {
      const response = await api.get('/users/stats');
      return {
        success: true,
        stats: response.data || response || {}
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques:', error);
      return {
        success: false,
        stats: {
          total: 0,
          active: 0,
          admins: 0,
          collaborateurs: 0
        },
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Réinitialiser le mot de passe d'un utilisateur
  async resetUserPassword(userId) {
    try {
      const response = await api.post(`/users/${userId}/reset-password`);
      return {
        success: true,
        data: response.data || response,
        message: 'Lien de réinitialisation envoyé'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default userService;