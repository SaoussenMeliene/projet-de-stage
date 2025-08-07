const API_BASE_URL = "http://localhost:5000/api";

// Service pour gérer les groupes
export const groupService = {
  // Récupérer tous les groupes de l'utilisateur
  async getUserGroups() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/user`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des groupes");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur getUserGroups:", error);
      throw error;
    }
  },

  // Récupérer les détails d'un groupe spécifique
  async getGroupDetails(groupId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du groupe");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur getGroupDetails:", error);
      throw error;
    }
  },

  // Créer un nouveau groupe
  async createGroup(groupData) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(groupData)
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la création du groupe");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur createGroup:", error);
      throw error;
    }
  },

  // Ajouter un membre au groupe (admin seulement)
  async addMemberToGroup(groupId, userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du membre");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur addMemberToGroup:", error);
      throw error;
    }
  },

  // Supprimer un membre du groupe (admin seulement)
  async removeMemberFromGroup(groupId, userId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du membre");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur removeMemberFromGroup:", error);
      throw error;
    }
  },

  // Quitter un groupe
  async leaveGroup(groupId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/leave`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la sortie du groupe");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur leaveGroup:", error);
      throw error;
    }
  },

  // Récupérer les statistiques du groupe
  async getGroupStats(groupId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des statistiques");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur getGroupStats:", error);
      throw error;
    }
  }
};

// Service pour gérer les participants aux défis
export const participantService = {
  // Rejoindre un défi (qui ajoute automatiquement au groupe)
  async joinChallenge(challengeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/participants/join/${challengeId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'inscription au défi");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur joinChallenge:", error);
      throw error;
    }
  },

  // Quitter un défi
  async leaveChallenge(challengeId) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/participants/leave/${challengeId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la sortie du défi");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur leaveChallenge:", error);
      throw error;
    }
  }
};

// Service pour les utilisateurs
export const userService = {
  // Rechercher des utilisateurs pour les ajouter aux groupes
  async searchUsers(query) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la recherche d'utilisateurs");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur searchUsers:", error);
      throw error;
    }
  },

  // Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Erreur getAllUsers:", error);
      throw error;
    }
  }
};
