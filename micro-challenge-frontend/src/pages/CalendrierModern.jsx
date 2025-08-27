import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import * as challengesService from "../services/challenges";
import { useTheme } from "../contexts/ThemeContext";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Target,
  Award,
  TrendingUp,
  Zap,
  Heart,
  Leaf,
  Palette,
  BookOpen,
  Star,
  ArrowRight,
  Eye,
  CheckCircle,
  AlertCircle,
  Play,
  UserCheck,
  Calendar
} from "lucide-react";

const CalendrierModern = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [userParticipations, setUserParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calendarStats, setCalendarStats] = useState({});
  const [, setSelectedDate] = useState(null);
  const { isDark } = useTheme();
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
    fetchCalendarData();
  }, [currentDate]);

  // Récupérer toutes les données du calendrier
  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('🔄 Récupération des données du calendrier...');
      
      // Récupérer les défis via le service challenges
      let challengesData = [];
      try {
        const challengesResponse = await challengesService.list({ limit: 100 });
        challengesData = challengesResponse.data?.items || challengesResponse.items || [];
        console.log('📊 Défis récupérés:', challengesData.length);
      } catch (challengeError) {
        console.log('ℹ️ Impossible de récupérer les défis via API:', challengeError.message);
      }

      // Récupérer les participations de l'utilisateur si connecté
      let participationsData = [];
      if (token) {
        try {
          const participationsResponse = await fetch('/api/participants/my-participations', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (participationsResponse.ok) {
            const participationsResult = await participationsResponse.json();
            participationsData = participationsResult?.participations || [];
            console.log('👤 Participations utilisateur récupérées:', participationsData.length);
          }
        } catch (participationError) {
          console.log('ℹ️ Impossible de récupérer les participations utilisateur:', participationError.message);
        }
      }

      // Si aucune donnée réelle, garder un tableau vide
      if (challengesData.length === 0) {
        console.log('ℹ️ Aucun défi trouvé dans la base de données');
        challengesData = [];
      }

      // Calculer les statistiques
      const stats = calculateCalendarStats(challengesData, participationsData);
      
      setChallenges(challengesData);
      setUserParticipations(participationsData);
      setCalendarStats(stats);
      
      console.log('✅ Données du calendrier chargées:', {
        challenges: challengesData.length,
        participations: participationsData.length,
        stats
      });

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données du calendrier:', error);
      // Données par défaut en cas d'erreur
      setChallenges([]);
      setUserParticipations([]);
      setCalendarStats({});
    } finally {
      setLoading(false);
    }
  };



  // Calculer les statistiques du calendrier
  const calculateCalendarStats = (challengesData, participationsData) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Filtrer les défis du mois actuel
    const thisMonthChallenges = challengesData.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      return (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) ||
             (endDate.getMonth() === currentMonth && endDate.getFullYear() === currentYear) ||
             (startDate <= new Date(currentYear, currentMonth, 1) && endDate >= new Date(currentYear, currentMonth + 1, 0));
    });
    

    
    const upcomingChallenges = challengesData.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      return startDate > today;
    });
    
    const completedChallenges = participationsData.filter(p => p.status === 'confirmé');
    
    // Calculer le total des participants
    const totalParticipants = challengesData.reduce((sum, challenge) => {
      return sum + (challenge.currentParticipants || 0);
    }, 0);
    
    return {
      thisMonthChallenges: thisMonthChallenges.length,
      upcomingEvents: upcomingChallenges.length,
      activeParticipants: totalParticipants,
      completedChallenges: completedChallenges.length
    };
  };

  // Fonctions utilitaires
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'environnement':
      case 'écologique':
        return Leaf;
      case 'bien-être':
      case 'santé':
        return Heart;
      case 'sportif':
      case 'sport':
        return Target;
      case 'créativité':
      case 'créatif':
      case 'art':
        return Palette;
      case 'solidaire':
      case 'solidarité':
        return Users;
      case 'éducatif':
      case 'éducation':
        return BookOpen;
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
      case 'santé':
        return 'from-pink-500 to-red-500';
      case 'sportif':
      case 'sport':
        return 'from-orange-500 to-red-600';
      case 'créativité':
      case 'créatif':
      case 'art':
        return 'from-purple-500 to-indigo-600';
      case 'solidaire':
      case 'solidarité':
        return 'from-cyan-500 to-blue-600';
      case 'éducatif':
      case 'éducation':
        return 'from-blue-500 to-indigo-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Navigation du calendrier
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Obtenir les défis pour une date donnée
  const getChallengesForDate = (date) => {
    return challenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
      
      return targetDate >= startDate && targetDate <= endDate;
    });
  };

  // Vérifier si l'utilisateur participe à un défi
  const isUserParticipating = (challengeId) => {
    return userParticipations.some(p => p.challenge?._id === challengeId || p.challenge?.id === challengeId);
  };

  // Gérer la participation à un défi
  const handleJoinChallenge = async (challengeId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Veuillez vous connecter pour participer aux défis');
        navigate('/login');
        return;
      }

      console.log(`🎯 Tentative de participation au défi: ${challengeId}`);
      
      await challengesService.joinChallenge(challengeId);
      
      alert('🎉 Vous avez rejoint le défi avec succès !');
      // Rafraîchir les données
      fetchCalendarData();
    } catch (error) {
      console.error('❌ Erreur lors de la participation:', error);
      alert('❌ Erreur lors de la participation au défi');
    }
  };

  // Gérer la vue détail d'un défi
  const handleViewChallenge = (challengeId) => {
    navigate(`/defis/${challengeId}`);
  };

  // Statistiques dynamiques du calendrier
  const dynamicCalendarStats = [
    { 
      icon: Target, 
      value: calendarStats.thisMonthChallenges || 0, 
      label: "Défis ce mois", 
      gradient: "from-blue-500 to-cyan-500",
      change: "+2"
    },
    { 
      icon: CalendarIcon, 
      value: calendarStats.upcomingEvents || 0, 
      label: "Événements à venir", 
      gradient: "from-green-500 to-emerald-500",
      change: "+1"
    },
    { 
      icon: Users, 
      value: calendarStats.activeParticipants || 0, 
      label: "Participants actifs", 
      gradient: "from-purple-500 to-pink-500",
      change: "+12"
    },
    { 
      icon: Award, 
      value: calendarStats.completedChallenges || 0, 
      label: "Défis terminés", 
      gradient: "from-yellow-500 to-orange-500",
      change: "+3"
    }
  ];

  // Filtrer et transformer les défis pour l'affichage
  const getUpcomingEvents = () => {
    const today = new Date();
    let filteredChallenges = challenges;
    
    // Filtrer pour ne garder que les défis actifs et à venir
    filteredChallenges = challenges.filter(challenge => {
      const endDate = new Date(challenge.endDate);
      return endDate >= today; // Défis qui ne sont pas encore terminés
    });
    
    // Filtrer par catégorie si sélectionnée
    if (filterCategory !== 'all') {
      filteredChallenges = filteredChallenges.filter(challenge => 
        challenge.category?.toLowerCase() === filterCategory.toLowerCase()
      );
    }
    
    // Trier par date de début (les plus proches en premier)
    filteredChallenges.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    
    // Transformer les défis pour l'affichage
    return filteredChallenges.slice(0, 6).map(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      const today = new Date();
      
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const isActive = today >= startDate && today <= endDate;
      const isUpcoming = startDate > today;
      const isParticipating = isUserParticipating(challenge._id);
      
      return {
        id: challenge._id,
        date: startDate.getDate().toString(),
        month: startDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        categoryIcon: getCategoryIcon(challenge.category),
        categoryGradient: getCategoryGradient(challenge.category),
        time: startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        duration: duration === 1 ? '1 jour' : `${duration} jours`,
        participants: challenge.participantsCount || 0,
        maxParticipants: 100, // Valeur par défaut
        location: "En ligne",
        status: isActive ? "En cours" : isUpcoming ? "À venir" : "Terminé",
        priority: 'medium', // Valeur par défaut pour l'instant
        points: challenge.rewardPoints || 100,
        difficulty: 'Facile', // Valeur par défaut
        isParticipating
      };
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-[#f0f9f6]'
      }`}>
        <HeaderDashboard />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 mb-8">
              <div className="h-8 bg-white/20 rounded w-1/3 mb-4"></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-4 h-20"></div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 bg-white rounded-3xl h-96"></div>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-3xl h-32"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-[#f0f9f6]'
    }`}>
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Hero section avec statistiques */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Effets de fond */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <CalendarIcon className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">Calendrier des Défis</h1>
                      <p className="text-purple-100">Planifiez et suivez vos participations aux challenges</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/30 transition-all duration-300">
                    <Plus size={20} />
                    <span className="font-semibold">Nouvel événement</span>
                  </button>
                </div>
              </div>
              
              {/* Statistiques en grille */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {dynamicCalendarStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <stat.icon className="text-white w-4 h-4" />
                      </div>
                      <span className="text-green-300 text-sm font-semibold">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-purple-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Grid Calendrier Professionnel */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Calendrier principal personnalisé */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header du calendrier */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigateMonth(-1)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold">
                    {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button 
                    onClick={() => navigateMonth(1)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={goToToday}
                    className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors duration-200"
                  >
                    Aujourd'hui
                  </button>
                </div>
              </div>
            </div>

            {/* Calendrier personnalisé */}
            <div className="p-6">
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map((day, index) => (
                  <div key={day} className={`text-center py-3 text-sm font-semibold ${index >= 5 ? 'text-red-500' : 'text-gray-600'}`}>
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille des jours */}
              <div className="grid grid-cols-7 gap-2">
                {/* Jours du mois précédent */}
                {[28, 29, 30, 31].map((day) => (
                  <div key={`prev-${day}`} className="aspect-square flex items-center justify-center text-gray-400 text-sm hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer">
                    {day}
                  </div>
                ))}

                {/* Jours du mois actuel */}
                {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                  const today = new Date();
                  const isToday = day === today.getDate() && 
                                 currentDate.getMonth() === today.getMonth() && 
                                 currentDate.getFullYear() === today.getFullYear();
                  
                  const dayEvents = getChallengesForDate(day);
                  const hasEvent = dayEvents.length > 0;
                  const primaryEvent = dayEvents[0];
                  const eventGradient = primaryEvent ? getCategoryGradient(primaryEvent.category) : '';
                  const isParticipating = primaryEvent ? isUserParticipating(primaryEvent._id) : false;
                  
                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer relative group ${
                        isToday
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg transform scale-105'
                          : hasEvent
                          ? `bg-gradient-to-r ${eventGradient} text-white shadow-md hover:shadow-lg hover:scale-105`
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      <span className="text-base">{day}</span>
                      
                      {/* Indicateurs d'événements */}
                      {hasEvent && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {dayEvents.slice(0, 3).map((_, index) => (
                            <div key={index} className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs font-bold text-white/90">+{dayEvents.length - 3}</div>
                          )}
                        </div>
                      )}
                      
                      {/* Badge de participation */}
                      {isParticipating && (
                        <div className="absolute top-1 right-1">
                          <UserCheck className="w-3 h-3 text-white/90" />
                        </div>
                      )}
                      
                      {/* Tooltip au hover */}
                      {hasEvent && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap max-w-xs">
                            {dayEvents.length === 1 ? primaryEvent.title : `${dayEvents.length} événements`}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Jours du mois suivant */}
                {[1, 2].map((day) => (
                  <div key={`next-${day}`} className="aspect-square flex items-center justify-center text-gray-400 text-sm hover:bg-gray-50 rounded-xl transition-colors duration-200 cursor-pointer">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar avec widgets */}
          <div className="space-y-6">
            {/* Widget Aujourd'hui */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Aujourd'hui</h3>
                  <p className="text-gray-600 text-sm">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Défis actifs aujourd'hui */}
                {(() => {
                  const today = new Date();
                  const todayEvents = getChallengesForDate(today.getDate());
                  const activeEvents = todayEvents.filter(challenge => {
                    const startDate = new Date(challenge.startDate);
                    const endDate = new Date(challenge.endDate);
                    return today >= startDate && today <= endDate;
                  });
                  
                  if (activeEvents.length > 0) {
                    return activeEvents.slice(0, 2).map((challenge) => (
                      <div key={challenge._id} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-green-700 font-medium text-sm">Défi en cours</span>
                        </div>
                        <p className="text-green-600 text-xs">{challenge.title}</p>
                      </div>
                    ));
                  }
                  
                  return (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3 border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-gray-600 font-medium text-sm">Aucun défi actif</span>
                      </div>
                      <p className="text-gray-500 text-xs">Consultez les prochains défis</p>
                    </div>
                  );
                })()}
                
                {/* Prochains événements */}
                {(() => {
                  const upcomingEvents = getUpcomingEvents().filter(event => event.status === 'À venir').slice(0, 1);
                  
                  if (upcomingEvents.length > 0) {
                    const event = upcomingEvents[0];
                    return (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-blue-700 font-medium text-sm">Prochain événement</span>
                        </div>
                        <p className="text-blue-600 text-xs">{event.title} - {event.date} {event.month}</p>
                      </div>
                    );
                  }
                  
                  return null;
                })()}
              </div>
            </div>

            {/* Widget Légende */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Légende
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Défis écologiques</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Événements éducatifs</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Activités créatives</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Actions solidaires</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                  <span className="text-gray-700 text-sm">Aujourd'hui</span>
                </div>
              </div>
            </div>

            {/* Widget Actions rapides */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                  <Plus size={18} />
                  <span>Créer un événement</span>
                </button>
                
                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <Filter size={18} />
                  <span>Filtrer les événements</span>
                </button>
              </div>
            </div>

            {/* Widget Statistiques rapides */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Ce mois-ci</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Événements</span>
                  <span className="font-semibold text-purple-600">{calendarStats.thisMonthChallenges || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Participants</span>
                  <span className="font-semibold text-green-600">{calendarStats.activeParticipants || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">À venir</span>
                  <span className="font-semibold text-blue-600">{calendarStats.upcomingEvents || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Terminés</span>
                  <span className="font-semibold text-yellow-600">{calendarStats.completedChallenges || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Événements à venir modernisée */}
        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Clock className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Événements à venir</h2>
                  <p className="text-gray-600">Découvrez les prochains défis et activités</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="solidaire">Solidaire</option>
                  <option value="écologique">Écologique</option>
                  <option value="créatif">Créatif</option>
                  <option value="sportif">Sportif</option>
                  <option value="éducatif">Éducatif</option>
                  <option value="bien-être">Bien-être</option>
                </select>
                
                <button 
                  onClick={() => navigate('/mes-defis')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <Eye size={18} />
                  <span>Voir tout</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getUpcomingEvents().length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun événement à venir</h3>
                  <p className="text-gray-500">Il n'y a actuellement aucun défi actif ou à venir. Revenez plus tard !</p>
                </div>
              ) : (
                getUpcomingEvents().map((event, index) => (
                <div
                  key={event.id}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Header avec date */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{event.date}</div>
                      <div className="text-sm text-gray-500 font-medium">{event.month}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-r ${event.categoryGradient} flex items-center justify-center`}>
                        <event.categoryIcon className="text-white w-4 h-4" />
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${event.categoryGradient} text-white`}>
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {event.description}
                    </p>
                  </div>

                  {/* Informations */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{event.time} • {event.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{event.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Badge de statut et priorité */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      event.status === 'En cours'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {event.status}
                    </span>

                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      event.priority === 'high'
                        ? 'bg-red-100 text-red-600'
                        : event.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {event.priority === 'high' ? 'Priorité haute' : event.priority === 'medium' ? 'Priorité moyenne' : 'Priorité basse'}
                    </span>
                  </div>

                  {/* Informations supplémentaires */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{event.points} points</span>
                    </div>
                    <div className="text-gray-600">
                      {event.participants}/{event.maxParticipants}
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="space-y-2">
                    {event.isParticipating ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewChallenge(event.id);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group-hover:shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Déjà inscrit</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinChallenge(event.id);
                          }}
                          className={`bg-gradient-to-r ${event.categoryGradient} text-white font-semibold py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1`}
                        >
                          <Play className="w-4 h-4" />
                          <span>Rejoindre</span>
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewChallenge(event.id);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Détails</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendrierModern;
