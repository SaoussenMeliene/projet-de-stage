import { api } from '../lib/axios';

export const participantService = {
  // Rejoindre un défi
  async joinChallenge(challengeId) {
    try {
      const response = await api.post(`/participants/join/${challengeId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la participation au défi:', error);
      throw error;
    }
  },

  // Quitter un défi
  async leaveChallenge(challengeId) {
    try {
      const response = await api.delete(`/participants/leave/${challengeId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'abandon du défi:', error);
      throw error;
    }
  },

  // Obtenir les participants d'un défi
  async getChallengeParticipants(challengeId) {
    try {
      const response = await api.get(`/participants/challenge/${challengeId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des participants:', error);
      throw error;
    }
  },

  // Obtenir mes participations
  async getMyParticipations() {
    try {
      const response = await api.get('/participants/my-participations');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des participations:', error);
      throw error;
    }
  }
};

export default participantService;