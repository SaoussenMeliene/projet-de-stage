import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_BASE = `${API_URL}/api`;

// Configuration axios avec token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const pollService = {
  // Créer un sondage dans un groupe
  async createGroupPoll(groupId, pollData) {
    try {
      const response = await axios.post(
        `${API_BASE}/polls/group/${groupId}`,
        pollData,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur création sondage:', error);
      throw error.response?.data || error;
    }
  },

  // Récupérer tous les sondages d'un groupe
  async getGroupPolls(groupId) {
    try {
      const url = `${API_BASE}/polls/group/${groupId}`;
      const headers = getAuthHeaders();
      
      console.log('🌐 Requête API sondages:', { url, headers });
      
      const response = await axios.get(url, { headers });
      
      console.log('📡 Réponse API sondages:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur API sondages:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error.response?.data || error;
    }
  },

  // Voter sur un sondage
  async voteOnPoll(pollId, optionIndex) {
    try {
      const response = await axios.post(
        `${API_BASE}/polls/${pollId}/vote`,
        { optionIndex },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur vote:', error);
      throw error.response?.data || error;
    }
  },

  // Clôturer un sondage
  async closePoll(pollId) {
    try {
      const response = await axios.patch(
        `${API_BASE}/polls/${pollId}/close`,
        {},
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur clôture sondage:', error);
      throw error.response?.data || error;
    }
  },

  // Voir les résultats d'un sondage
  async getPollResults(pollId) {
    try {
      const response = await axios.get(
        `${API_BASE}/polls/${pollId}`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur résultats sondage:', error);
      throw error.response?.data || error;
    }
  }
};