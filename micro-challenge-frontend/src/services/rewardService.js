import { api } from '../lib/axios';

export const rewardService = {
  // Récupérer toutes les récompenses
  async getRewards() {
    try {
      const response = await api.get('/reward-catalog');
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
      // Adapter les données pour correspondre au modèle backend
      const backendData = {
        name: rewardData.name,
        description: rewardData.description,
        pointsRequired: rewardData.pointsRequired || rewardData.points,
        stock: rewardData.stock || 1
      };
      
      const response = await api.post('/reward-catalog', backendData);
      return {
        success: true,
        reward: response.data?.reward || response.data,
        message: response.data?.msg || 'Récompense créée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la création de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message
      };
    }
  },

  // Supprimer une récompense
  async deleteReward(rewardId) {
    try {
      await api.delete(`/reward-catalog/${rewardId}`);
      return {
        success: true,
        message: 'Récompense supprimée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message
      };
    }
  },

  // Mettre à jour une récompense
  async updateReward(rewardId, rewardData) {
    try {
      // Adapter les données pour correspondre au modèle backend
      const backendData = {
        name: rewardData.name,
        description: rewardData.description,
        pointsRequired: rewardData.pointsRequired || rewardData.points,
        stock: rewardData.stock || 1
      };
      
      const response = await api.put(`/reward-catalog/${rewardId}`, backendData);
      return {
        success: true,
        reward: response.data?.reward || response.data,
        message: response.data?.msg || 'Récompense mise à jour avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de la récompense:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || error.message
      };
    }
  },

  // Récupérer les statistiques des récompenses
  async getRewardStats() {
    try {
      // Pour l'instant, calculer les stats côté frontend
      const rewardsResponse = await this.getRewards();
      const userRewardsResponse = await this.getMyClaimedRewards();
      
      if (!rewardsResponse.success) {
        throw new Error('Impossible de charger les récompenses');
      }
      
      const rewards = rewardsResponse.rewards || [];
      const claimedRewards = userRewardsResponse.success ? userRewardsResponse.claimedRewards : [];
      
      const stats = {
        actives: rewards.length,
        obtenues: claimedRewards.length,
        pointsDistribues: claimedRewards.reduce((total, reward) => total + (reward.pointsSpent || 0), 0)
      };
      
      return {
        success: true,
        stats
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
        error: error.message
      };
    }
  },

  // Attribuer une récompense à un utilisateur (fonction administrative)
  async assignReward(userId, rewardId) {
    try {
      // Cette fonctionnalité pourrait être ajoutée plus tard au backend
      console.warn('assignReward: Fonctionnalité non implémentée côté backend');
      return {
        success: false,
        error: 'Fonctionnalité non disponible'
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
      // Pour l'instant, utiliser l'endpoint des récompenses échangées
      const response = await api.get('/user-rewards/my-claimed');
      return {
        success: true,
        rewards: response.data?.claimedRewards || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des récompenses utilisateur:', error);
      return {
        success: false,
        rewards: [],
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Échanger une récompense contre des points
  async claimReward(rewardData) {
    try {
      console.log('🔍 DEBUG - Données d\'échange:', rewardData);
      
      // Vérifier le token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('🔑 Token présent:', !!token);
      if (token) {
        console.log('🔑 Token (premiers caractères):', token.substring(0, 20) + '...');
      }
      
      const response = await api.post('/user-rewards/claim', rewardData);
      console.log('✅ Réponse API:', response);
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || 'Récompense échangée avec succès'
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'échange de la récompense:', error);
      console.error('❌ Détails erreur:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Erreur lors de l\'échange de la récompense';
      
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      error.response.data.msg || 
                      errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
        message: errorMessage
      };
    }
  },

  // Récupérer les récompenses échangées par l'utilisateur connecté
  async getMyClaimedRewards() {
    try {
      const response = await api.get('/user-rewards/my-claimed');
      return {
        success: true,
        claimedRewards: response.data.claimedRewards || []
      };
    } catch (error) {
      console.error('❌ Erreur lors du chargement des récompenses échangées:', error);
      return {
        success: false,
        claimedRewards: [],
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default rewardService;