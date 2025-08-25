import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import {
  Trophy,
  Recycle,
  Users,
  Leaf,
  Lock,
  Star,
  Gift,
  Award,
  Target,
  CheckCircle,
  Heart,
  Palette,
  Book,
  Dumbbell,
  Zap,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles
} from "lucide-react";

const Recompenses = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [userStats, setUserStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setIsVisible(true);
    fetchRewardsData();
  }, []);

  // Récupérer toutes les données de récompenses
  const fetchRewardsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ Aucun token trouvé');
        setLoading(false);
        return;
      }

      console.log('🔄 Récupération des données de récompenses...');
      
      // Récupérer les participations de l'utilisateur
      const participationsResponse = await fetch('/api/participants/my-participations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      let participationsData = [];
      if (participationsResponse.ok) {
        const participationsResult = await participationsResponse.json();
        participationsData = participationsResult?.participations || [];
        console.log('📊 Participations récupérées:', participationsData.length);
      }

      // Si aucune participation réelle, créer des données de démonstration
      if (participationsData.length === 0) {
        console.log('🎭 Création de données de démonstration pour les récompenses');
        participationsData = [
          {
            _id: 'demo-part-1',
            status: 'confirmé',
            score: 92,
            joinedAt: new Date('2024-01-15'),
            challenge: {
              _id: 'demo-ch-1',
              title: 'Défi Écologique',
              category: 'Environnement',
              endDate: new Date('2024-01-25')
            }
          },
          {
            _id: 'demo-part-2',
            status: 'confirmé',
            score: 85,
            joinedAt: new Date('2024-01-20'),
            challenge: {
              _id: 'demo-ch-2',
              title: 'Challenge Sport',
              category: 'Bien-être',
              endDate: new Date('2024-02-05')
            }
          },
          {
            _id: 'demo-part-3',
            status: 'en attente',
            score: 65,
            joinedAt: new Date('2024-01-25'),
            challenge: {
              _id: 'demo-ch-3',
              title: 'Défi Créatif',
              category: 'Créativité',
              endDate: new Date('2024-02-15')
            }
          }
        ];
      }

      // Calculer les statistiques utilisateur
      const calculatedStats = calculateUserStats(participationsData);
      setUserStats(calculatedStats);
      setUserPoints(calculatedStats.totalPoints);

      // Générer les badges basés sur les vraies données
      const generatedBadges = generateBadges(participationsData, calculatedStats);
      setBadges(generatedBadges);

      // Générer les récompenses disponibles
      const generatedRewards = generateRewards(calculatedStats.totalPoints);
      setRewards(generatedRewards);

      console.log('✅ Données de récompenses chargées:', {
        points: calculatedStats.totalPoints,
        badges: generatedBadges.length,
        rewards: generatedRewards.length
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données de récompenses:', error);
      // Données par défaut en cas d'erreur
      setUserPoints(0);
      setBadges([]);
      setRewards([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques utilisateur
  const calculateUserStats = (participations) => {
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

    return {
      totalPoints,
      completedChallenges: completedChallenges.length,
      activeChallenges: activeChallenges.length,
      averageScore,
      categoriesStats,
      highScoreChallenges: completedChallenges.filter(p => p.score >= 80).length,
      participationStreak: calculateStreak(participations),
      totalParticipations: participations.length
    };
  };

  // Calculer la série de participations
  const calculateStreak = (participations) => {
    // Simuler une série basée sur les dates de participation
    const sortedParticipations = participations
      .sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
    
    return Math.min(sortedParticipations.length, 7); // Max 7 jours de série
  };

  // Générer les badges basés sur les vraies données
  const generateBadges = (participations, stats) => {
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

    return [
      {
        id: 1,
        name: "Eco-Warrior",
        description: "Complétez 3 défis écologiques",
        icon: Leaf,
        color: "from-green-400 to-emerald-500",
        progress: Math.min(100, (envChallenges / 3) * 100),
        unlocked: envChallenges >= 3,
        requirement: "3 défis écologiques",
        current: envChallenges,
        total: 3,
        category: "Environnement"
      },
      {
        id: 2,
        name: "Champion du Bien-être",
        description: "Terminez 2 défis de bien-être",
        icon: Heart,
        color: "from-pink-400 to-red-500",
        progress: Math.min(100, (wellnessChallenges / 2) * 100),
        unlocked: wellnessChallenges >= 2,
        requirement: "2 défis bien-être",
        current: wellnessChallenges,
        total: 2,
        category: "Bien-être"
      },
      {
        id: 3,
        name: "Artiste Créatif",
        description: "Participez à 2 défis créatifs",
        icon: Palette,
        color: "from-purple-400 to-indigo-500",
        progress: Math.min(100, (creativeChallenges / 2) * 100),
        unlocked: creativeChallenges >= 2,
        requirement: "2 défis créatifs",
        current: creativeChallenges,
        total: 2,
        category: "Créativité"
      },
      {
        id: 4,
        name: "Perfectionniste",
        description: "Obtenez un score > 80 dans 2 défis",
        icon: Star,
        color: "from-yellow-400 to-orange-500",
        progress: Math.min(100, (stats.highScoreChallenges / 2) * 100),
        unlocked: stats.highScoreChallenges >= 2,
        requirement: "2 défis avec score > 80",
        current: stats.highScoreChallenges,
        total: 2,
        category: "Performance"
      },
      {
        id: 5,
        name: "Participant Assidu",
        description: "Participez à 5 défis au total",
        icon: Trophy,
        color: "from-amber-400 to-yellow-500",
        progress: Math.min(100, (stats.totalParticipations / 5) * 100),
        unlocked: stats.totalParticipations >= 5,
        requirement: "5 participations",
        current: stats.totalParticipations,
        total: 5,
        category: "Engagement"
      },
      {
        id: 6,
        name: "Série Gagnante",
        description: "Maintenez une série de 7 jours",
        icon: Zap,
        color: "from-blue-400 to-cyan-500",
        progress: Math.min(100, (stats.participationStreak / 7) * 100),
        unlocked: stats.participationStreak >= 7,
        requirement: "7 jours de série",
        current: stats.participationStreak,
        total: 7,
        category: "Régularité"
      }
    ];
  };

  // Générer les récompenses basées sur les points
  const generateRewards = (currentPoints) => {
    return [
      {
        id: 1,
        name: "Gourde écologique",
        points: 200,
        image: "🍃",
        category: "Accessoires",
        available: true,
        description: "Gourde réutilisable en bambou"
      },
      {
        id: 2,
        name: "Bon d'achat bio 10€",
        points: 300,
        image: "🛒",
        category: "Shopping",
        available: true,
        description: "Utilisable dans nos magasins partenaires"
      },
      {
        id: 3,
        name: "Plante de bureau",
        points: 250,
        image: "🌱",
        category: "Bureau",
        available: true,
        description: "Plante dépolluante pour votre espace de travail"
      },
      {
        id: 4,
        name: "Kit zéro déchet",
        points: 400,
        image: "♻️",
        category: "Lifestyle",
        available: true,
        description: "Kit complet pour réduire vos déchets"
      },
      {
        id: 5,
        name: "Bon d'achat bio 20€",
        points: 500,
        image: "💳",
        category: "Shopping",
        available: true,
        description: "Bon d'achat premium"
      },
      {
        id: 6,
        name: "Cours de yoga en ligne",
        points: 350,
        image: "🧘",
        category: "Bien-être",
        available: true,
        description: "Accès 3 mois aux cours de yoga"
      },
      {
        id: 7,
        name: "Livre développement durable",
        points: 180,
        image: "📚",
        category: "Éducation",
        available: true,
        description: "Sélection de livres écologiques"
      },
      {
        id: 8,
        name: "Badge premium",
        points: 600,
        image: "🏆",
        category: "Prestige",
        available: currentPoints >= 500,
        description: "Badge premium pour votre profil"
      }
    ];
  };

  // Gérer l'échange de récompenses
  const handleClaimReward = async (reward) => {
    if (userPoints < reward.points || !reward.available) {
      return;
    }

    try {
      console.log(`🎁 Tentative d'échange de la récompense: ${reward.name}`);
      
      // Simuler l'API d'échange (en attendant une vraie API)
      const newPoints = userPoints - reward.points;
      setUserPoints(newPoints);
      setClaimedRewards([...claimedRewards, reward.id]);
      
      // Notification de succès
      setToastMessage(`🎉 Félicitations ! Vous avez échangé "${reward.name}" pour ${reward.points} points !`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
      
      console.log(`✅ Récompense échangée avec succès. Points restants: ${newPoints}`);
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'échange de la récompense:', error);
      alert('❌ Erreur lors de l\'échange. Veuillez réessayer.');
    }
  };

  // Filtrer les récompenses non réclamées
  const availableRewards = rewards.filter(reward => !claimedRewards.includes(reward.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9f6]">
        <HeaderDashboard />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Header Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Récompenses</h1>
                <p className="text-gray-600 text-lg">Découvrez vos badges et échangez vos points contre des récompenses</p>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userPoints}</div>
                  <div className="text-sm opacity-90">Points disponibles</div>
                  
                  {userStats && (
                    <div className="mt-2 pt-2 border-t border-purple-300/50">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="font-semibold">{userStats.completedChallenges}</div>
                          <div className="opacity-75">Défis terminés</div>
                        </div>
                        <div>
                          <div className="font-semibold">{badges.filter(b => b.unlocked).length}</div>
                          <div className="opacity-75">Badges obtenus</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Mes Badges */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Mes Badges</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <div key={badge.id} className="relative group">
                    <div className={`bg-white rounded-2xl p-6 border-2 transition-all duration-300 ${
                      badge.unlocked
                        ? 'border-green-200 shadow-lg hover:shadow-xl'
                        : 'border-gray-200 opacity-75'
                    }`}>

                      {/* Badge Icon */}
                      <div className="flex justify-center mb-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                          badge.unlocked
                            ? `bg-gradient-to-r ${badge.color}`
                            : 'bg-gray-200'
                        }`}>
                          {badge.unlocked ? (
                            <IconComponent className="w-10 h-10 text-white" />
                          ) : (
                            <Lock className="w-10 h-10 text-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Badge Info */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                        
                        {/* Badge Category */}
                        <div className="mb-3">
                          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                            {badge.category}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        {!badge.unlocked && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{badge.current || 0}/{badge.total}</span>
                              <span>{Math.round(badge.progress)}% complété</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${badge.color} transition-all duration-500`}
                                style={{ width: `${badge.progress}%` }}
                              ></div>
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {badge.requirement}
                            </div>
                          </div>
                        )}

                        {badge.unlocked && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Débloqué</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Badge obtenu ! 🎉
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Récompenses Disponibles */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Récompenses Disponibles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">

                  {/* Reward Image */}
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-3xl shadow-md">
                      {reward.image}
                    </div>
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      {reward.category}
                    </span>
                  </div>

                  {/* Reward Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{reward.name}</h3>
                    
                    {reward.description && (
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    )}

                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-800">{reward.points}</span>
                      <span className="text-sm text-gray-500">points</span>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleClaimReward(reward)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                          reward.available && userPoints >= reward.points
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!reward.available || userPoints < reward.points}
                      >
                        {!reward.available
                          ? 'Indisponible'
                          : userPoints >= reward.points
                            ? 'Échanger maintenant'
                            : `${reward.points - userPoints} points manquants`
                        }
                      </button>
                      
                      {/* Progress vers cette récompense */}
                      {userPoints < reward.points && reward.available && (
                        <div className="w-full">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progression</span>
                            <span>{Math.round((userPoints / reward.points) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="h-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
                              style={{ width: `${Math.min(100, (userPoints / reward.points) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucune récompense disponible */}
            {availableRewards.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Toutes les récompenses ont été échangées !</h3>
                <p className="text-gray-600">Continuez à participer aux défis pour obtenir plus de points.</p>
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-8 text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gagnez plus de points !</h3>
              <p className="text-gray-600 mb-4">Participez à des défis pour débloquer plus de récompenses</p>
              <button
                onClick={() => navigate('/mes-defis')}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                Voir les défis
              </button>
            </div>
          </div>
        </div>

        {/* Section Historique des échanges */}
        {claimedRewards.length > 0 && (
          <div className={`mt-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Mes Récompenses Échangées</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {claimedRewards.map((rewardId) => {
                  const reward = rewards.find(r => r.id === rewardId);
                  if (!reward) return null;
                  
                  return (
                    <div key={rewardId} className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm">
                          {reward.image}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{reward.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{reward.points} points</span>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Section Statistiques */}
        <div className={`mt-8 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Badges débloqués */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {badges.filter(b => b.unlocked).length}/{badges.length}
                  </div>
                  <div className="text-sm text-gray-500">Badges débloqués</div>
                </div>
              </div>
            </div>

            {/* Points totaux */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{userPoints}</div>
                  <div className="text-sm text-gray-500">Points totaux</div>
                </div>
              </div>
            </div>

            {/* Score moyen */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {userStats ? userStats.averageScore : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Score moyen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-white border border-green-200 rounded-xl shadow-xl p-4 flex items-center gap-3 animate-pulse">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{toastMessage}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recompenses;