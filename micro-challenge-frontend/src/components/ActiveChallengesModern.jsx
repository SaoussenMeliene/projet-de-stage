import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Clock,
  Target,
  Award,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  CheckCircle,
  Heart,
  Leaf,
  Palette,
  Star,
  MoreHorizontal,
  Upload,
  MessageSquare,
  Eye
} from "lucide-react";

export default function ActiveChallengesModern() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchActiveChallenges();
  }, []);

  // Récupérer les défis actifs de l'utilisateur
  const fetchActiveChallenges = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('❌ Aucun token trouvé');
        setLoading(false);
        return;
      }

      console.log('🔄 Récupération des défis actifs...');
      
      // Récupérer les participations actives de l'utilisateur
      const participationsResponse = await fetch('/api/participants/my-participations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (participationsResponse.ok) {
        const participationsResult = await participationsResponse.json();
        let participationsData = participationsResult?.participations || [];
        
        console.log('📊 Participations récupérées:', participationsData);

        // Si aucune participation réelle, garder la liste vide pour afficher l'état vide
        if (participationsData.length === 0) {
          console.log('🎯 Aucune participation trouvée - affichage de l\'état vide');
          setActiveChallenges([]);
          setLoading(false);
          return;
        }

        // Filtrer les défis actifs (en attente ou confirmé)
        const activeParticipations = participationsData.filter(p => 
          p.status === 'en attente' || p.status === 'confirmé'
        );

        // Transformer les participations en format de défi avec données enrichies
        const transformedChallenges = activeParticipations.map(participation => {
          const challenge = participation.challenge;
          const now = new Date();
          const endDate = new Date(challenge.endDate);
          const startDate = new Date(challenge.startDate);
          const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
          const daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          const progress = participation.score || Math.max(10, Math.min(90, ((totalDays - daysLeft) / totalDays) * 100));

          return {
            id: challenge._id,
            participationId: participation._id,
            title: challenge.title,
            description: challenge.description,
            category: challenge.category || 'Général',
            categoryIcon: getCategoryIcon(challenge.category),
            categoryGradient: getCategoryGradient(challenge.category),
            status: participation.status === 'confirmé' ? 'En cours' : 'En attente',
            statusColor: participation.status === 'confirmé' ? 'green' : 'orange',
            days: totalDays,
            daysLeft: Math.max(0, daysLeft),
            progress: Math.round(progress),
            participants: Math.floor(Math.random() * 15) + 5, // Simulé
            date: formatDateRange(challenge.startDate, challenge.endDate),
            points: getPointsForCategory(challenge.category),
            difficulty: getDifficulty(totalDays),
            priority: participation.status === 'confirmé' ? 'high' : 'medium',
            joinedAt: participation.joinedAt,
            tasks: generateTasksForChallenge(challenge.category, progress)
          };
        });

        console.log('✅ Défis actifs transformés:', transformedChallenges);
        setActiveChallenges(transformedChallenges);
      } else {
        console.error('❌ Erreur récupération participations');
        setActiveChallenges([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des défis actifs:', error);
      setActiveChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonctions utilitaires
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'environnement':
      case 'écologique':
        return Leaf;
      case 'bien-être':
      case 'sport':
        return Heart;
      case 'créatif':
      case 'créativité':
        return Palette;
      default:
        return Target;
    }
  };

  const getCategoryGradient = (category) => {
    switch (category?.toLowerCase()) {
      case 'environnement':
      case 'écologique':
        return 'from-green-500 to-emerald-600';
      case 'bien-être':
      case 'sport':
        return 'from-pink-500 to-red-500';
      case 'créatif':
      case 'créativité':
        return 'from-indigo-500 to-purple-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  const getPointsForCategory = (category) => {
    switch (category?.toLowerCase()) {
      case 'environnement':
        return 200;
      case 'bien-être':
        return 150;
      case 'créatif':
        return 300;
      default:
        return 100;
    }
  };

  const getDifficulty = (days) => {
    if (days <= 7) return 'Facile';
    if (days <= 21) return 'Moyen';
    return 'Difficile';
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    const end = new Date(endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    return `${start} - ${end}`;
  };

  const generateTasksForChallenge = (category, progress) => {
    const baseTasks = [
      { name: "Planification", completed: progress > 20 },
      { name: "Première étape", completed: progress > 40 },
      { name: "Suivi mi-parcours", completed: progress > 60 },
      { name: "Finalisation", completed: progress > 80 }
    ];
    
    if (category?.toLowerCase().includes('environnement')) {
      return [
        { name: "Audit des habitudes", completed: progress > 25 },
        { name: "Alternatives trouvées", completed: progress > 50 },
        { name: "Mise en pratique", completed: progress > 75 },
        { name: "Bilan final", completed: false }
      ];
    }
    
    return baseTasks;
  };

  // Fonctions d'action pour les défis
  const handleViewChallenge = (challengeId) => {
    navigate(`/defis/${challengeId}`);
  };

  const handleSubmitProof = (challengeId, participationId) => {
    // Navigation vers la page de soumission de preuve
    navigate(`/submit-proof/${challengeId}`, { 
      state: { participationId } 
    });
  };

  const handleViewGroup = (challengeId) => {
    // Navigation vers le groupe de discussion
    navigate(`/groups/challenge/${challengeId}`);
  };

  const calculateAverageProgress = () => {
    if (activeChallenges.length === 0) return 0;
    const totalProgress = activeChallenges.reduce((sum, challenge) => sum + challenge.progress, 0);
    return Math.round(totalProgress / activeChallenges.length);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-500 bg-yellow-50';
      case 'low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En cours': return <Play className="w-4 h-4" />;
      case 'À venir': return <Clock className="w-4 h-4" />;
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header de section */}
      <div className={`flex items-center justify-between transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <Target className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Vos défis actifs</h2>
            <p className="text-gray-600 text-sm">Continuez vos défis en cours et suivez votre progression</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>
              {loading ? "Chargement..." : `Progression moyenne: ${calculateAverageProgress()}%`}
            </span>
          </div>
          {!loading && (
            <div className={`flex items-center gap-2 ${activeChallenges.length > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
              <Target className="w-4 h-4" />
              <span>{activeChallenges.length} défi{activeChallenges.length > 1 ? 's' : ''} actif{activeChallenges.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grille des défis */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl shadow-xl p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-2xl mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-2 bg-gray-200 rounded-full w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activeChallenges.length === 0 ? (
        <div className="text-center py-16">
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Cercles animés en arrière-plan */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full animate-pulse delay-75"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Target className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">0 défis actifs</h3>
            <p className="text-gray-600 mb-2 text-lg">Vous n'avez rejoint aucun défi pour le moment.</p>
            <p className="text-gray-500 mb-8 text-sm">
              Explorez les défis disponibles et rejoignez ceux qui vous inspirent pour commencer à gagner des points !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 px-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Target className="w-5 h-5" />
                Découvrir les défis
              </button>
              
              <button
                onClick={() => navigate('/comment-ca-marche')}
                className="bg-white text-gray-700 border-2 border-gray-200 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Comment ça marche ?
              </button>
            </div>
          </div>
          
          {/* Stats inspirantes */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700 mb-1">50+</div>
              <div className="text-sm text-green-600">Défis écologiques</div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <div className="text-2xl font-bold text-pink-700 mb-1">30+</div>
              <div className="text-sm text-pink-600">Défis bien-être</div>
            </div>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-indigo-700 mb-1">1000+</div>
              <div className="text-sm text-indigo-600">Points à gagner</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {activeChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            onClick={() => navigate(`/defi/${challenge.id}`)}
            className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100 ${
              isVisible ? 'animate-slideInUp' : 'opacity-0 translate-y-8'
            }`}
            style={{
              animationDelay: `${index * 150}ms`,
            }}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
            
            {/* Header coloré */}
            <div className="relative h-32 overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.categoryGradient} opacity-90`}></div>
              <div className="absolute inset-0 bg-black/10"></div>
              
              {/* Icône de catégorie */}
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <challenge.categoryIcon className="text-white w-5 h-5" />
                </div>
              </div>
              
              {/* Badge de statut */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1`}>
                  {getStatusIcon(challenge.status)}
                  <span className="text-xs font-semibold text-gray-800">{challenge.status}</span>
                </div>
              </div>
              
              {/* Priorité */}
              <div className="absolute bottom-4 left-4">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(challenge.priority)}`}>
                  Priorité {challenge.priority === 'high' ? 'Haute' : challenge.priority === 'medium' ? 'Moyenne' : 'Basse'}
                </span>
              </div>
              
              {/* Points */}
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Award className="text-yellow-300 w-4 h-4" />
                  <span className="text-white text-xs font-bold">{challenge.points} pts</span>
                </div>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {/* Header avec catégorie */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${challenge.categoryGradient} text-white`}>
                  {challenge.category}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{challenge.daysLeft} jours restants</span>
                </div>
              </div>

              {/* Titre et description */}
              <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                {challenge.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                {challenge.description}
              </p>

              {/* Progression détaillée */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progression</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className={`h-full bg-gradient-to-r ${challenge.categoryGradient} rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${challenge.progress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                  </div>
                </div>
                
                {/* Tâches */}
                <div className="space-y-1">
                  {challenge.tasks.slice(0, 2).map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={task.completed ? 'text-green-600 line-through' : 'text-gray-600'}>
                        {task.name}
                      </span>
                    </div>
                  ))}
                  {challenge.tasks.length > 2 && (
                    <div className="text-xs text-gray-500">+{challenge.tasks.length - 2} autres tâches</div>
                  )}
                </div>
              </div>

              {/* Informations */}
              <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{challenge.participants} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{challenge.date}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewChallenge(challenge.id);
                  }}
                  className={`flex-1 bg-gradient-to-r ${challenge.categoryGradient} hover:shadow-lg text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Voir détails</span>
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmitProof(challenge.id, challenge.participationId);
                    }}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-600 p-2 rounded-xl transition-colors duration-200"
                    title="Soumettre une preuve"
                  >
                    <Upload className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewGroup(challenge.id);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-xl transition-colors duration-200"
                    title="Groupe de discussion"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Effet de bordure au hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${challenge.categoryGradient} p-[2px]`}>
              <div className="w-full h-full bg-white rounded-3xl"></div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Styles CSS */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
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
