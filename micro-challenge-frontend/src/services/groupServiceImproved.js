import { api } from '../utils/apiClient';
import { SUCCESS_MESSAGES } from '../utils/constants';

/**
 * Service amélioré pour la gestion des groupes
 * Utilise le client API centralisé et gère les erreurs
 */
export const groupServiceImproved = {
  /**
   * Récupère tous les groupes de l'utilisateur
   */
  async getUserGroups(params = {}) {
    try {
      const data = await api.get('/groups/user', params);
      return data;
    } catch (error) {
      console.error('Erreur getUserGroups:', error);
      throw error;
    }
  },

  /**
   * Récupère un groupe spécifique
   */
  async getGroupById(groupId) {
    try {
      const data = await api.get(`/groups/${groupId}`);
      return data;
    } catch (error) {
      console.error('Erreur getGroupById:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau groupe
   */
  async createGroup(groupData) {
    try {
      const data = await api.post('/groups', groupData);
      return {
        ...data,
        message: SUCCESS_MESSAGES.GROUP_CREATED
      };
    } catch (error) {
      console.error('Erreur createGroup:', error);
      throw error;
    }
  },

  /**
   * Met à jour un groupe
   */
  async updateGroup(groupId, groupData) {
    try {
      const data = await api.put(`/groups/${groupId}`, groupData);
      return {
        ...data,
        message: SUCCESS_MESSAGES.GROUP_UPDATED
      };
    } catch (error) {
      console.error('Erreur updateGroup:', error);
      throw error;
    }
  },

  /**
   * Supprime un groupe
   */
  async deleteGroup(groupId) {
    try {
      const data = await api.delete(`/groups/${groupId}`);
      return {
        ...data,
        message: SUCCESS_MESSAGES.GROUP_DELETED
      };
    } catch (error) {
      console.error('Erreur deleteGroup:', error);
      throw error;
    }
  },

  /**
   * Ajoute un membre à un groupe
   */
  async addMemberToGroup(groupId, memberData) {
    try {
      const data = await api.post(`/groups/${groupId}/members`, memberData);
      return {
        ...data,
        message: SUCCESS_MESSAGES.MEMBER_ADDED
      };
    } catch (error) {
      console.error('Erreur addMemberToGroup:', error);
      throw error;
    }
  },

  /**
   * Retire un membre d'un groupe
   */
  async removeMemberFromGroup(groupId, memberId) {
    try {
      const data = await api.delete(`/groups/${groupId}/members/${memberId}`);
      return {
        ...data,
        message: SUCCESS_MESSAGES.MEMBER_REMOVED
      };
    } catch (error) {
      console.error('Erreur removeMemberFromGroup:', error);
      throw error;
    }
  },

  /**
   * Récupère les messages d'un groupe
   */
  async getGroupMessages(groupId, params = {}) {
    try {
      const data = await api.get(`/groups/${groupId}/messages`, params);
      return data;
    } catch (error) {
      console.error('Erreur getGroupMessages:', error);
      throw error;
    }
  },

  /**
   * Envoie un message dans un groupe
   */
  async sendMessage(groupId, messageData) {
    try {
      const data = await api.post(`/groups/${groupId}/messages`, messageData);
      return {
        ...data,
        message: SUCCESS_MESSAGES.MESSAGE_SENT
      };
    } catch (error) {
      console.error('Erreur sendMessage:', error);
      throw error;
    }
  },

  /**
   * Upload d'un fichier dans un groupe
   */
  async uploadFile(groupId, file, additionalData = {}) {
    try {
      const data = await api.uploadFile(`/groups/${groupId}/files`, file, additionalData);
      return data;
    } catch (error) {
      console.error('Erreur uploadFile:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques d'un groupe
   */
  async getGroupStats(groupId) {
    try {
      const data = await api.get(`/groups/${groupId}/stats`);
      return data;
    } catch (error) {
      console.error('Erreur getGroupStats:', error);
      throw error;
    }
  },

  /**
   * Rejoint un groupe
   */
  async joinGroup(groupId) {
    try {
      const data = await api.post(`/groups/${groupId}/join`);
      return data;
    } catch (error) {
      console.error('Erreur joinGroup:', error);
      throw error;
    }
  },

  /**
   * Quitte un groupe
   */
  async leaveGroup(groupId) {
    try {
      const data = await api.post(`/groups/${groupId}/leave`);
      return data;
    } catch (error) {
      console.error('Erreur leaveGroup:', error);
      throw error;
    }
  }
};
