import { useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/groupService';

/**
 * Hook personnalisé pour gérer les groupes
 * Sépare la logique métier du composant UI
 */
export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Couleurs et thèmes constants
  const AVATAR_COLORS = [
    "from-blue-500 to-purple-500",
    "from-green-500 to-emerald-500", 
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500"
  ];

  const THEME_COLORS = ["blue", "green", "purple", "orange", "cyan"];

  // Fonctions utilitaires
  const getAvatarColor = useCallback((index) => {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }, []);

  const getThemeColor = useCallback((index) => {
    return THEME_COLORS[index % THEME_COLORS.length];
  }, []);

  const getGroupIcon = useCallback((category) => {
    const iconMap = {
      'écologique': 'Leaf',
      'environnement': 'Leaf',
      'technologie': 'Code',
      'tech': 'Code',
      'marketing': 'Briefcase',
      'communication': 'Briefcase'
    };
    return iconMap[category?.toLowerCase()] || 'Target';
  }, []);

  const getGroupStatus = useCallback((activeParticipants) => {
    if (activeParticipants >= 10) return "Très actif";
    if (activeParticipants >= 5) return "Actif";
    return "En cours";
  }, []);

  // Transformation des données
  const formatGroupData = useCallback((rawGroups) => {
    return rawGroups.map((group, index) => ({
      id: group._id,
      nom: group.name,
      description: group.challenge?.description || "Groupe de défi",
      avatar: group.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
      avatarColor: getAvatarColor(index),
      membres: group.stats?.totalMembers || group.members?.length || 0,
      defisActifs: 1,
      points: group.stats?.totalPoints || 0,
      objectif: group.challenge?.title || "Défi en cours",
      progression: Math.min(100, Math.max(0, (group.stats?.activeParticipants || 0) * 20)),
      couleurTheme: getThemeColor(index),
      icone: getGroupIcon(group.challenge?.category),
      statut: getGroupStatus(group.stats?.activeParticipants || 0),
      dernierDefi: group.challenge?.title || "Aucun défi",
      challengeId: group.challenge?._id,
      members: group.members || []
    }));
  }, [getAvatarColor, getThemeColor, getGroupIcon, getGroupStatus]);

  // Chargement des groupes
  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupService.getUserGroups();
      const formattedGroups = formatGroupData(data);
      setGroups(formattedGroups);
    } catch (err) {
      console.error("Erreur lors du chargement des groupes:", err);
      setError("Impossible de charger les groupes");
    } finally {
      setLoading(false);
    }
  }, [formatGroupData]);

  // Rechargement des groupes
  const refreshGroups = useCallback(() => {
    loadGroups();
  }, [loadGroups]);

  // Chargement initial
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups,
    loading,
    error,
    refreshGroups,
    loadGroups
  };
};
