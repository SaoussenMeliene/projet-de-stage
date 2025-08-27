/**
 * Service pour gérer les statistiques utilisateur
 */

// Utiliser le proxy Vite configuré
const API_BASE = "/api";

/**
 * Calcule les badges basés sur les statistiques
 * @param {Object} stats - Les statistiques de l'utilisateur
 * @returns {Array} Liste des badges
 */
export const calculateBadges = (stats) => {
  const badges = [];

  // Badge Expert Écologique - 10+ défis complétés
  if (stats.challengesCompleted >= 10) {
    badges.push({
      id: 'expert_eco',
      name: 'Expert Écologique',
      type: 'achievement',
      color: 'text-green-300',
      description: `${stats.challengesCompleted} défis écologiques complétés`,
      requirement: 'Compléter 10 défis écologiques',
      achieved: true
    });
  }

  // Badge Top Contributeur - 1000+ points
  if (stats.totalPoints >= 1000) {
    badges.push({
      id: 'top_contributor',
      name: 'Top Contributeur', 
      type: 'points',
      color: 'text-yellow-300',
      description: `${stats.totalPoints} points gagnés`,
      requirement: 'Gagner 1000 points',
      achieved: true
    });
  }

  // Badge Série - 5+ jours consécutifs
  if (stats.currentStreak >= 5) {
    badges.push({
      id: 'streak',
      name: `Série de ${stats.currentStreak} jours`,
      type: 'streak',
      color: 'text-orange-300', 
      description: `${stats.currentStreak} jours consécutifs d'activité`,
      requirement: 'Rester actif 5 jours consécutifs',
      achieved: true
    });
  }



  // Badge Persévérant - 25+ défis
  if (stats.challengesCompleted >= 25) {
    badges.push({
      id: 'persistent', 
      name: 'Persévérant',
      type: 'achievement',
      color: 'text-purple-300',
      description: `${stats.challengesCompleted} défis complétés avec succès`,
      requirement: 'Compléter 25 défis',
      achieved: true
    });
  }

  return badges;
};

/**
 * Récupère les statistiques utilisateur depuis l'API
 * @param {string} token - Token d'authentification
 * @returns {Promise<Object>} Statistiques utilisateur
 */
export const fetchUserStats = async (token) => {
  try {
    console.log('📊 Récupération des statistiques utilisateur depuis l\'API...');
    
    const response = await fetch(`${API_BASE}/users/me/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Statistiques récupérées depuis l\'API:', data);
      
      // Calculer les badges basés sur les vraies données
      const badges = calculateBadges({
        challengesCompleted: data.challengesCompleted || 0,
        currentStreak: data.currentStreak || 0,
        totalPoints: data.totalPoints || 0
      });

      const result = {
        challengesCompleted: data.challengesCompleted || 0,
        currentStreak: data.currentStreak || 0,
        totalPoints: data.totalPoints || 0,
        lastLoginDate: data.lastLoginDate ? new Date(data.lastLoginDate) : new Date(),
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        memberSince: data.memberSince ? new Date(data.memberSince) : new Date(),
        badges: badges
      };
      
      console.log('✅ Données finales formatées:', result);
      return result;
    } else {
      console.warn('⚠️ Erreur API stats:', response.status, response.statusText);
      const errorText = await response.text();
      console.warn('⚠️ Détail de l\'erreur:', errorText);
    }
  } catch (error) {
    console.warn('⚠️ API stats non disponible:', error.message);
  }

  // Si l'API n'est pas disponible, retourner des données vides (vraies données d'un nouvel utilisateur)
  console.log('📊 Utilisation de données d\'utilisateur nouveau (0 défis, 0 points, 0 jours)');
  const fallbackStats = {
    challengesCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    lastLoginDate: new Date(),
    joinDate: new Date(), // Date actuelle si pas de données
    memberSince: new Date(),
    badges: []
  };

  // Calculer les badges basés sur ces données (sera vide)
  fallbackStats.badges = calculateBadges(fallbackStats);
  
  return fallbackStats;
};

/**
 * Génère des statistiques de démonstration réalistes
 * @returns {Object} Statistiques de démonstration
 */
export const generateDemoStats = () => {
  // Génère des stats basées sur la date actuelle pour un effet réaliste
  const now = new Date();
  const dayOfMonth = now.getDate();
  
  const stats = {
    challengesCompleted: Math.min(15 + (dayOfMonth % 10), 30), // Entre 15-25 défis
    currentStreak: Math.min(7 + (dayOfMonth % 5), 14), // Entre 7-12 jours
    totalPoints: 1250 + (dayOfMonth * 50), // Points basés sur le jour
    lastLoginDate: new Date(), // Connexion actuelle
    joinDate: new Date(Date.now() - (30 + dayOfMonth) * 24 * 60 * 60 * 1000), // Membre depuis ~1-2 mois
    badges: []
  };

  // Calcule les badges basés sur ces stats
  stats.badges = calculateBadges(stats);

  return stats;
};

/**
 * Formate la durée d'appartenance
 * @param {Date} joinDate - Date d'inscription 
 * @returns {string} Durée formatée
 */
export const formatMembershipDuration = (joinDate) => {
  if (!joinDate) return 'Date inconnue';
  
  const now = new Date();
  const diffTime = Math.abs(now - new Date(joinDate));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mois`;
  } else {
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} an${years > 1 ? 's' : ''}${months > 0 ? ` et ${months} mois` : ''}`;
  }
};

export default {
  fetchUserStats,
  generateDemoStats,
  calculateBadges,
  formatMembershipDuration
};