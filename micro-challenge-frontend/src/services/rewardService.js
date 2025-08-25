import { api } from '../lib/axios';

export const rewardService = {
  // Récupérer toutes les récompenses
  async getRewards() {
    try {
      const response = await api.get('/rewards');
      return {
        success: true,
        rewards: response.data || response || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des récompenses:', error);
      return {
        success: false,
        rewards: [],
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Créer une nouvelle récompense
  async createReward(rewardData) {
    try {
      const response = await api.post('/rewards', rewardData);
      return {
        success: true,
        reward: response.data || response,
        message: 'Récompense créée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Supprimer une récompense
  async deleteReward(rewardId) {
    try {
      await api.delete(`/rewards/${rewardId}`);
      return {
        success: true,
        message: 'Récompense supprimée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Mettre à jour une récompense
  async updateReward(rewardId, rewardData) {
    try {
      const response = await api.put(`/rewards/${rewardId}`, rewardData);
      return {
        success: true,
        reward: response.data || response,
        message: 'Récompense mise à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Récupérer les statistiques des récompenses
  async getRewardStats() {
    try {
      const response = await api.get('/rewards/stats');
      return {
        success: true,
        stats: response.data || response || {}
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des statistiques des récompenses:', error);
      return {
        success: false,
        stats: {
          actives: 0,
          obtenues: 0,
          pointsDistribues: 0
        },
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Attribuer une récompense à un utilisateur
  async assignReward(userId, rewardId) {
    try {
      const response = await api.post(`/rewards/${rewardId}/assign`, { userId });
      return {
        success: true,
        data: response.data || response,
        message: 'Récompense attribuée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'attribution de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Récupérer les récompenses d'un utilisateur
  async getUserRewards(userId) {
    try {
      const response = await api.get(`/users/${userId}/rewards`);
      return {
        success: true,
        rewards: response.data || response || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des récompenses utilisateur:', error);
      return {
        success: false,
        rewards: [],
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default rewardService;