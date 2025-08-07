import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer l'authentification
 * Centralise la logique d'authentification
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('collaborateur');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération du token
  const getToken = useCallback(() => {
    return localStorage.getItem("token");
  }, []);

  // Vérification si l'utilisateur est connecté
  const isAuthenticated = useCallback(() => {
    return !!getToken();
  }, [getToken]);

  // Chargement du profil utilisateur
  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserRole(data.user.role || 'collaborateur');
      } else {
        throw new Error('Erreur lors du chargement du profil');
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  // Déconnexion
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserRole('collaborateur');
  }, []);

  // Chargement initial
  useEffect(() => {
    if (isAuthenticated()) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadUserProfile]);

  return {
    user,
    userRole,
    loading,
    error,
    isAuthenticated: isAuthenticated(),
    loadUserProfile,
    logout,
    getToken
  };
};
