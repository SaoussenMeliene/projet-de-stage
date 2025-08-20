import { api } from '../lib/axios';

export const proofService = {
  // Soumettre une preuve
  async submitProof(challengeId, proofData) {
    try {
      const formData = new FormData();
      
      formData.append('type', proofData.type);
      formData.append('description', proofData.description);
      
      if (proofData.type === 'text') {
        formData.append('textContent', proofData.textContent);
      } else if (proofData.file) {
        formData.append('proofFile', proofData.file);
      }

      const response = await api.post(`/proofs/submit/${challengeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la soumission de preuve:', error);
      throw error;
    }
  },

  // Obtenir mes preuves
  async getMyProofs() {
    try {
      const response = await api.get('/proofs/my-proofs');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des preuves:', error);
      throw error;
    }
  },

  // Obtenir une preuve spécifique
  async getProofById(proofId) {
    try {
      const response = await api.get(`/proofs/${proofId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la preuve:', error);
      throw error;
    }
  },

  // Obtenir mes preuves pour un défi spécifique
  async getMyProofsForChallenge(challengeId) {
    try {
      const response = await api.get(`/proofs/my-proofs?challengeId=${challengeId}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des preuves du défi:', error);
      throw error;
    }
  },

  // === FONCTIONS ADMIN ===

  // Obtenir les preuves en attente (Admin)
  async getPendingProofs() {
    try {
      const response = await api.get('/proofs/admin/pending');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des preuves en attente:', error);
      throw error;
    }
  },

  // Obtenir toutes les preuves avec filtres (Admin)
  async getAllProofs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.challengeId) params.append('challengeId', filters.challengeId);
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/proofs/admin/all?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des preuves:', error);
      throw error;
    }
  },

  // Approuver une preuve (Admin)
  async approveProof(proofId, comment = '') {
    try {
      const response = await api.put(`/proofs/admin/${proofId}/approve`, {
        comment
      });
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la preuve:', error);
      throw error;
    }
  },

  // Rejeter une preuve (Admin)
  async rejectProof(proofId, comment = '') {
    try {
      const response = await api.put(`/proofs/admin/${proofId}/reject`, {
        comment
      });
      return response;
    } catch (error) {
      console.error('Erreur lors du rejet de la preuve:', error);
      throw error;
    }
  }
};

export default proofService;