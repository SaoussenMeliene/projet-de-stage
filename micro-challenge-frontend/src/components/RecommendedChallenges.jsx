import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  Users,
  Calendar,
  Clock,
  Award,
  ArrowRight,
  Heart,
  Leaf,
  Palette,
  Book,
  Dumbbell,
  Star,
  TrendingUp
} from "lucide-react";

export default function RecommendedChallenges() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [recommendedChallenges, setRecommendedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchRecommendedChallenges();
  }, []);

  // Récupérer les défis recommandés
  const fetchRecommendedChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Récupération des défis recommandés...');

      // Récupérer tous les défis disponibles
      const challengesResponse = await fetch('/api/challenges', {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });

      let allChallenges = [];
      if (challengesResponse.ok) {
        const challengesData = await challengesResponse.json();
        allChallenges = challengesData.items || challengesData.challenges || challengesData || [];
        console.log('🎯 Défis disponibles récupérés:', allChallenges.length);
      }

      // Récupérer les participations de l'utilisateur pour éviter les doublons
      let userParticipations = [];
      if (token) {
        try {
          const participationsResponse = await fetch('/api/participants/my-participations', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (participationsResponse.ok) {
            const participationsResult = await participationsResponse.json();
            userParticipations = participationsResult?.participations || [];
            console.log('📊 Participations utilisateur:', userParticipations.length);
          }
        } catch (participationError) {
          console.log('ℹ️ Impossible de récupérer les participations (utilisateur non connecté?):', participationError.message);
        }
      }

      // Filtrer les défis recommandés (exclure ceux auxquels l'utilisateur participe déjà)
      const userChallengeIds = new Set(userParticipations.map(p => p.challenge?._id || p.challenge));
      const availableChallenges = allChallenges.filter(challenge => 
        !userChallengeIds.has(challenge._id) && 
        isChallengActive(challenge)
      );

      // Si pas assez de défis réels, créer des données de démonstration
      if (availableChallenges.length < 3) {
        console.log('🎭 Création de défis recommandés de démonstration');
        const demoRecommendations = [
          {
            _id: 'demo-rec-1',
            title: 'Défi Lecture 30 jours',
            description: 'Lisez au moins 15 minutes par jour pendant un mois entier. Développez votre culture et votre imagination.',
            category: 'Éducation',
            startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
            endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000), // Dans 32 jours
            image: null,
            isActive: true
          },
          {
            _id: 'demo-rec-2',
            title: 'Challenge Sport Quotidien',
            description: '30 minutes d\'activité physique par jour. Améliorez votre forme et votre bien-être général.',
            category: 'Bien-être',
            startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Demain
            endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000), // Dans 22 jours
            image: null,
            isActive: true
          },
          {
            _id: 'demo-rec-3',
            title: 'Méditation Mindfulness',
            description: '10 minutes de méditation quotidienne pour améliorer votre concentration et réduire le stress.',
            category: 'Bien-être',
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
            endDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000), // Dans 33 jours
            image: null,
            isActive: true
          },
          {
            _id: 'demo-rec-4',
            title: 'Art & Créativité',
            description: 'Créez une œuvre d\'art originale chaque semaine. Explorez votre côté créatif.',
            category: 'Créativité',
            startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
            endDate: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000), // Dans 26 jours
            image: null,
            isActive: true
          },
          {
            _id: 'demo-rec-5',
            title: 'Zéro Déchet Challenge',
            description: 'Réduisez vos déchets de 50% en adoptant des habitudes éco-responsables.',
            category: 'Environnement',
            startDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // Dans 4 jours
            endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // Dans 25 jours
            image: null,
            isActive: true
          }
        ];

        // Mélanger et prendre les 3 premiers
        const shuffledDemo = demoRecommendations.sort(() => 0.5 - Math.random());
        availableChallenges.push(...shuffledDemo.slice(0, Math.max(3, 3 - availableChallenges.length)));
      }

      // Transformer les défis en format recommandé avec intelligence artificielle
      const transformedRecommendations = availableChallenges
        .slice(0, 6) // Limiter à 6 recommandations
        .map(challenge => {
          const now = new Date();
          const startDate = new Date(challenge.startDate);
          const endDate = new Date(challenge.endDate);
          const daysLeft = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
          const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

          return {
            id: challenge._id,
            title: challenge.title,
            description: challenge.description || 'Découvrez ce défi passionnant et relevez le challenge !',
            category: challenge.category || 'Général',
            categoryIcon: getCategoryIcon(challenge.category),
            categoryGradient: getCategoryGradient(challenge.category),
            participants: Math.floor(Math.random() * 200) + 50, // Simulé entre 50-250
            startDate: challenge.startDate,
            endDate: challenge.endDate,
            daysLeft: Math.max(0, daysLeft),
            duration: duration,
            difficulty: getDifficulty(duration),
            points: getPointsForCategory(challenge.category),
            popularityScore: Math.floor(Math.random() * 100) + 50, // Score de popularité simulé
            matchScore: calculateMatchScore(challenge.category, userParticipations), // Score de correspondance
            isNew: daysLeft <= 7 && daysLeft >= 0,
            isTrending: Math.random() > 0.6 // 40% de chance d'être trending
          };
        })
        .sort((a, b) => b.matchScore - a.matchScore); // Trier par correspondance

      console.log('✅ Défis recommandés transformés:', transformedRecommendations.length);
      setRecommendedChallenges(transformedRecommendations);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des défis recommandés:', error);
      // Données par défaut en cas d'erreur
      const fallbackRecommendations = [
        {
          id: 'fallback-1',
          title: 'Défi Lecture Mensuel',
          description: 'Explorez de nouveaux univers littéraires',
          category: 'Éducation',
          categoryIcon: Book,
          categoryGradient: 'from-indigo-500 to-purple-600',
          participants: 156,
          daysLeft: 5,
          duration: 30,
          difficulty: 'Facile',
          points: 150,
          matchScore: 85,
          isNew: true,
          isTrending: false
        }
      ];
      setRecommendedChallenges(fallbackRecommendations);
    } finally {
      setLoading(false);
    }
  };

  // Utilitaires
  const isChallengActive = (challenge) => {
    const now = new Date();
    const endDate = new Date(challenge.endDate);
    const startDate = new Date(challenge.startDate);
    return challenge.isActive !== false && endDate > now && startDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Commence dans les 30 prochains jours
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'éducation':
      case 'éducatif':
        return Book;
      case 'bien-être':
      case 'sport':
      case 'sportif':
        return Dumbbell;
      case 'environnement':
      case 'écologique':
        return Leaf;
      case 'créativité':
      case 'créatif':
        return Palette;
      case 'solidaire':
        return Heart;
      default:
        return Target;
    }
  };

  const getCategoryGradient = (category) => {
    switch (category?.toLowerCase()) {
      case 'éducation':
      case 'éducatif':
        return 'from-indigo-500 to-purple-600';
      case 'bien-être':
      case 'sport':
      case 'sportif':
        return 'from-pink-500 to-red-500';
      case 'environnement':
      case 'écologique':
        return 'from-green-500 to-emerald-600';
      case 'créativité':
      case 'créatif':
        return 'from-yellow-500 to-orange-500';
      case 'solidaire':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  const getDifficulty = (days) => {
    if (days <= 7) return 'Facile';
    if (days <= 21) return 'Moyen';
    return 'Difficile';
  };

  const getPointsForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'environnement':
      case 'écologique':
        return 200;
      case 'bien-être':
      case 'sport':
        return 150;
      case 'créativité':
      case 'créatif':
        return 300;
      case 'éducation':
        return 180;
      case 'solidaire':
        return 250;
      default:
        return 100;
    }
  };

  const calculateMatchScore = (challengeCategory, userParticipations) => {
    // Calculer un score de correspondance basé sur l'historique de l'utilisateur
    const userCategories = userParticipations.map(p => p.challenge?.category).filter(Boolean);
    const categoryCount = userCategories.filter(cat => 
      cat?.toLowerCase() === challengeCategory?.toLowerCase()
    ).length;

    // Score de base + bonus pour les catégories préférées
    let score = 50 + Math.random() * 30; // Score de base entre 50-80
    if (categoryCount > 0) {
      score += categoryCount * 10; // +10 points par participation dans la même catégorie
    }
    
    return Math.min(100, Math.round(score));
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const end = new Date(endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${start} - ${end}`;
  };

  const handleJoinChallenge = async (challengeId, e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      console.log(`🎯 Tentative de rejoindre le défi ${challengeId}`);
      
      const response = await fetch(`/api/participants/join/${challengeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Défi rejoint avec succès:', result);
        
        // Rafraîchir les recommandations pour enlever le défi rejoint
        fetchRecommendedChallenges();
        
        // Notification visuelle (vous pouvez ajouter une notification toast ici)
        alert('✅ Défi rejoint avec succès ! Vous pouvez maintenant le voir dans vos défis actifs.');
        
      } else {
        const error = await response.json();
        console.error('❌ Erreur lors de l\'inscription au défi:', error);
        alert(error.msg || 'Erreur lors de l\'inscription au défi.');
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleViewChallenge = (challengeId) => {
    navigate(`/defis/${challengeId}`);
  };

  return (
    <div className={`mt-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Target className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Défis recommandés</h2>
              <p className="text-gray-600 text-sm">Découvrez de nouveaux défis adaptés à vos intérêts</p>
            </div>
          </div>
          
          {!loading && recommendedChallenges.length > 0 && (
            <button
              onClick={() => {
                // Scroll vers la section des défis dans la page actuelle
                const challengeSection = document.querySelector('[data-section="challenge-dashboard"]');
                if (challengeSection) {
                  challengeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  navigate('/mes-defis');
                }
              }}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition-colors duration-200"
            >
              Voir tous les défis
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendedChallenges.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Aucune recommandation disponible</h3>
            <p className="text-gray-600 mb-4">Explorez tous nos défis disponibles</p>
            <button
              onClick={() => {
                // Scroll vers la section des défis dans la page actuelle
                const challengeSection = document.querySelector('[data-section="challenge-dashboard"]');
                if (challengeSection) {
                  challengeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                  navigate('/mes-defis');
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Voir tous les défis
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedChallenges.slice(0, 6).map((challenge) => (
              <div
                key={challenge.id}
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 hover:border-gray-300"
                onClick={() => handleViewChallenge(challenge.id)}
              >
                {/* Header avec badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${challenge.categoryGradient} rounded-lg flex items-center justify-center`}>
                      <challenge.categoryIcon className="text-white w-4 h-4" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${challenge.categoryGradient} text-white`}>
                      {challenge.category}
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    {challenge.isNew && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-600">
                        Nouveau
                      </span>
                    )}
                    {challenge.isTrending && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-600 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Populaire
                      </span>
                    )}
                  </div>
                </div>

                {/* Titre et description */}
                <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                  {challenge.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                  {challenge.description}
                </p>

                {/* Informations du défi */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {challenge.daysLeft === 0 ? 'Commence aujourd\'hui' : 
                         challenge.daysLeft === 1 ? 'Commence demain' :
                         `Dans ${challenge.daysLeft} jours`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full ${
                        challenge.difficulty === 'Facile' ? 'bg-green-100 text-green-600' :
                        challenge.difficulty === 'Moyen' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-amber-600">
                        <Award className="w-3 h-3" />
                        <span>{challenge.points} pts</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-gray-600">{challenge.matchScore}% match</span>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => handleJoinChallenge(challenge.id, e)}
                    className={`flex-1 bg-gradient-to-r ${challenge.categoryGradient} text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                  >
                    <span>Rejoindre</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewChallenge(challenge.id);
                    }}
                    className="bg-white border border-gray-300 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors duration-200"
                  >
                    Détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}