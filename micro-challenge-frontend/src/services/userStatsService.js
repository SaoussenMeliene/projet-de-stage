/**
 * Service pour gérer les statistiques utilisateur
 */

// Utiliser le proxy Vite configuré
const API_BASE = "/api";

/**
 * Calcule les badges basés sur les participations (même logique que la page Récompenses)
 * @param {Array} participations - Les participations de l'utilisateur
 * @param {Object} stats - Les statistiques de l'utilisateur
 * @returns {Array} Liste des badges
 */
/**
 * Calcule les statistiques utilisateur à partir des participations (même logique que Recompenses.jsx)
 * @param {Array} participations - Les participations de l'utilisateur
 * @returns {Object} Statistiques calculées
 */
export const calculateUserStatsFromParticipations = (participations) => {
  const completedChallenges = participations.filter(p => p.status === 'confirmé');
  const activeChallenges = participations.filter(p => p.status === 'en attente' || p.status === 'confirmé');
  
  // Calculer les points
  let totalPoints = 0;
  completedChallenges.forEach(p => {
    const basePoints = 100; // Points de base par défi terminé
    const bonusPoints = p.score > 80 ? 50 : p.score > 60 ? 25 : 0; // Bonus selon le score
    totalPoints += basePoints + bonusPoints;
  });

  // Points pour les défis en cours
  activeChallenges.forEach(p => {
    if (p.status === 'en attente') {
      totalPoints += 25; // Points partiels pour participation
    }
  });

  // Calculer les statistiques par catégorie
  const categoriesStats = {};
  participations.forEach(p => {
    const category = p.challenge?.category || 'Général';
    if (!categoriesStats[category]) {
      categoriesStats[category] = { completed: 0, active: 0, totalScore: 0 };
    }
    
    if (p.status === 'confirmé') {
      categoriesStats[category].completed += 1;
      categoriesStats[category].totalScore += p.score || 0;
    } else if (p.status === 'en attente') {
      categoriesStats[category].active += 1;
    }
  });

  const averageScore = completedChallenges.length > 0 
    ? Math.round(completedChallenges.reduce((sum, p) => sum + (p.score || 0), 0) / completedChallenges.length)
    : 0;

  // Calculer la série de participations
  const sortedParticipations = participations
    .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
  const participationStreak = Math.min(sortedParticipations.length, 7); // Max 7 jours de série

  return {
    totalPoints,
    completedChallenges: completedChallenges.length,
    activeChallenges: activeChallenges.length,
    averageScore,
    categoriesStats,
    highScoreChallenges: completedChallenges.filter(p => p.score >= 80).length,
    participationStreak,
    totalParticipations: participations.length
  };
};

export const calculateBadges = (participations, stats) => {
  if (!participations) {
    participations = [];
  }
  if (!stats) {
    stats = { highScoreChallenges: 0, totalParticipations: 0, participationStreak: 0 };
  }

  const envChallenges = participations.filter(p => 
    p.challenge?.category?.toLowerCase().includes('environnement') && p.status === 'confirmé'
  ).length;

  const wellnessChallenges = participations.filter(p => 
    (p.challenge?.category?.toLowerCase().includes('bien-être') || 
     p.challenge?.category?.toLowerCase().includes('sport')) && p.status === 'confirmé'
  ).length;

  const creativeChallenges = participations.filter(p => 
    (p.challenge?.category?.toLowerCase().includes('créat') ||
     p.challenge?.category?.toLowerCase().includes('art')) && p.status === 'confirmé'
  ).length;

  const highScoreChallenges = stats.highScoreChallenges || 0;
  const totalParticipations = stats.totalParticipations || participations.length;
  const participationStreak = stats.participationStreak || 0;

  // Retourne TOUS les badges avec la propriété unlocked (même logique que Recompenses.jsx)
  return [
    {
      id: 1,
      name: "Eco-Warrior",
      type: 'achievement',
      color: 'text-green-300',
      description: "Complétez 3 défis écologiques",
      requirement: "3 défis écologiques",
      unlocked: envChallenges >= 3,
      progress: Math.min(100, (envChallenges / 3) * 100),
      current: envChallenges,
      total: 3,
      category: "Environnement"
    },
    {
      id: 2,
      name: "Champion du Bien-être",
      type: 'achievement',
      color: 'text-pink-300',
      description: "Terminez 2 défis de bien-être",
      requirement: "2 défis bien-être",
      unlocked: wellnessChallenges >= 2,
      progress: Math.min(100, (wellnessChallenges / 2) * 100),
      current: wellnessChallenges,
      total: 2,
      category: "Bien-être"
    },
    {
      id: 3,
      name: "Artiste Créatif",
      type: 'achievement',
      color: 'text-purple-300',
      description: "Participez à 2 défis créatifs",
      requirement: "2 défis créatifs",
      unlocked: creativeChallenges >= 2,
      progress: Math.min(100, (creativeChallenges / 2) * 100),
      current: creativeChallenges,
      total: 2,
      category: "Créativité"
    },
    {
      id: 4,
      name: "Perfectionniste",
      type: 'points',
      color: 'text-yellow-300',
      description: "Obtenez un score > 80 dans 2 défis",
      requirement: "2 défis avec score > 80",
      unlocked: highScoreChallenges >= 2,
      progress: Math.min(100, (highScoreChallenges / 2) * 100),
      current: highScoreChallenges,
      total: 2,
      category: "Performance"
    },
    {
      id: 5,
      name: "Participant Assidu",
      type: 'milestone',
      color: 'text-amber-300',
      description: "Participez à 5 défis au total",
      requirement: "5 participations",
      unlocked: totalParticipations >= 5,
      progress: Math.min(100, (totalParticipations / 5) * 100),
      current: totalParticipations,
      total: 5,
      category: "Engagement"
    },
    {
      id: 6,
      name: "Série Gagnante",
      type: 'streak',
      color: 'text-blue-300',
      description: "Maintenez une série de 7 jours",
      requirement: "7 jours de série",
      unlocked: participationStreak >= 7,
      progress: Math.min(100, (participationStreak / 7) * 100),
      current: participationStreak,
      total: 7,
      category: "Régularité"
    }
  ];
};

/**
 * Récupère les statistiques utilisateur depuis l'API (même logique que la page Récompenses)
 * @param {string} token - Token d'authentification
 * @returns {Promise<Object>} Statistiques utilisateur
 */
export const fetchUserStats = async (token) => {
  try {
    console.log('📊 Récupération des statistiques utilisateur depuis l\'API...');
    
    // Récupérer les participations de l'utilisateur (même que Recompenses.jsx)
    const participationsResponse = await fetch(`${API_BASE}/participants/my-participations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    let participationsData = [];
    if (participationsResponse.ok) {
      const participationsResult = await participationsResponse.json();
      participationsData = participationsResult?.participations || [];
      console.log('📊 Participations récupérées:', participationsData.length);
    }

    // Calculer les statistiques utilisateur avec la même logique que Recompenses.jsx
    const calculatedStats = calculateUserStatsFromParticipations(participationsData);
    
    // Générer les badges basés sur les vraies données avec la même logique
    const badges = calculateBadges(participationsData, calculatedStats);

    const result = {
      challengesCompleted: calculatedStats.completedChallenges,
      currentStreak: calculatedStats.participationStreak,
      totalPoints: calculatedStats.totalPoints,
      lastLoginDate: new Date(),
      joinDate: new Date(), // Date actuelle si pas de données
      memberSince: new Date(),
      badges: badges
    };
    
    console.log('✅ Données finales formatées (même logique que Récompenses):', result);
    console.log('🏆 Total badges:', badges.length, '| Badges débloqués:', badges.filter(b => b.unlocked).length);
    return result;

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
    joinDate: new Date(),
    memberSince: new Date(),
    badges: []
  };

  return fallbackStats;
};

/**
 * Génère des statistiques de démonstration réalistes avec la même logique que les récompenses
 * @returns {Object} Statistiques de démonstration
 */
export const generateDemoStats = () => {
  // Génère des participations de démonstration
  const now = new Date();
  const dayOfMonth = now.getDate();
  
  const demoParticipations = [
    {
      challenge: { category: 'Environnement' },
      status: 'confirmé',
      score: 85,
      joinedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      challenge: { category: 'Bien-être' },
      status: 'confirmé',
      score: 92,
      joinedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      challenge: { category: 'Créativité' },
      status: 'confirmé',
      score: 78,
      joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    // Ajouter plus selon le jour du mois
    ...(dayOfMonth > 15 ? [{
      challenge: { category: 'Environnement' },
      status: 'confirmé',
      score: 88,
      joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }] : [])
  ];

  // Calculer les stats avec la même logique
  const calculatedStats = calculateUserStatsFromParticipations(demoParticipations);
  
  // Générer les badges avec la même logique
  const badges = calculateBadges(demoParticipations, calculatedStats);

  const stats = {
    challengesCompleted: calculatedStats.completedChallenges,
    currentStreak: calculatedStats.participationStreak,
    totalPoints: calculatedStats.totalPoints,
    lastLoginDate: new Date(),
    joinDate: new Date(Date.now() - (30 + dayOfMonth) * 24 * 60 * 60 * 1000),
    memberSince: new Date(Date.now() - (30 + dayOfMonth) * 24 * 60 * 60 * 1000),
    badges: badges
  };

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
  calculateUserStatsFromParticipations,
  formatMembershipDuration
};