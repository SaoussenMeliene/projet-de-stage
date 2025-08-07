import React, { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
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
  Eye
} from "lucide-react";

const CalendrierModern = () => {
  const [date] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Statistiques du calendrier
  const calendarStats = [
    { 
      icon: Target, 
      value: 12, 
      label: "Défis ce mois", 
      gradient: "from-blue-500 to-cyan-500",
      change: "+3"
    },
    { 
      icon: CalendarIcon, 
      value: 5, 
      label: "Événements à venir", 
      gradient: "from-green-500 to-emerald-500",
      change: "+2"
    },
    { 
      icon: Users, 
      value: 247, 
      label: "Participants actifs", 
      gradient: "from-purple-500 to-pink-500",
      change: "+15"
    },
    { 
      icon: Award, 
      value: 8, 
      label: "Défis terminés", 
      gradient: "from-yellow-500 to-orange-500",
      change: "+1"
    }
  ];

  // Événements modernes
  const events = [
    {
      id: 1,
      date: "25",
      month: "JAN",
      title: "Défi Recyclage - Semaine 3",
      description: "Continuez votre parcours vers le zéro déchet",
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      time: "09:00",
      duration: "7 jours",
      participants: 156,
      location: "En ligne",
      status: "En cours",
      priority: "high"
    },
    {
      id: 2,
      date: "27",
      month: "JAN",
      title: "Atelier Compost Collectif",
      description: "Apprenez les techniques de compostage urbain",
      category: "Éducatif",
      categoryIcon: BookOpen,
      categoryGradient: "from-blue-500 to-indigo-600",
      time: "14:00",
      duration: "2 heures",
      participants: 24,
      location: "Jardin partagé",
      status: "À venir",
      priority: "medium"
    },
    {
      id: 3,
      date: "30",
      month: "JAN",
      title: "Challenge Zéro Déchet",
      description: "Relevez le défi ultime du mode de vie sans déchet",
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      time: "08:00",
      duration: "1 semaine",
      participants: 89,
      location: "Partout",
      status: "À venir",
      priority: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {calendarStats.map((stat, index) => (
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
                  <button className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200">
                    <ChevronLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-bold">
                    {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <button className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors duration-200">
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
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                  const isToday = day === new Date().getDate();
                  const hasEvent = [25, 27, 30].includes(day);
                  const eventType = day === 25 ? 'green' : day === 27 ? 'blue' : day === 30 ? 'purple' : '';
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square flex flex-col items-center justify-center text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer relative group ${
                        isToday
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg transform scale-105'
                          : hasEvent
                          ? eventType === 'green'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                            : eventType === 'blue'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105'
                          : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                      }`}
                    >
                      <span className="text-base">{day}</span>
                      {hasEvent && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-1.5 h-1.5 bg-white/80 rounded-full"></div>
                        </div>
                      )}
                      
                      {/* Tooltip au hover */}
                      {hasEvent && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                            {day === 25 ? 'Défi Recyclage' : day === 27 ? 'Atelier Compost' : 'Challenge Zéro Déchet'}
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
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium text-sm">Défi en cours</span>
                  </div>
                  <p className="text-green-600 text-xs">Recyclage - Jour 3/7</p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 font-medium text-sm">Rappel</span>
                  </div>
                  <p className="text-blue-600 text-xs">Atelier compost - 14h00</p>
                </div>
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
                  <span className="font-semibold text-purple-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Participants</span>
                  <span className="font-semibold text-green-600">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Défis actifs</span>
                  <span className="font-semibold text-blue-600">8</span>
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

              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                <Eye size={18} />
                <span>Voir tout</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event, index) => (
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

                  {/* Bouton d'action */}
                  <button className={`w-full bg-gradient-to-r ${event.categoryGradient} text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group-hover:shadow-lg`}>
                    <span>Voir détails</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendrierModern;
