import React, { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  Plus,
  Filter,
  Grid,
  List,
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
  Dumbbell,
  Star,
  ArrowRight,
  Eye
} from "lucide-react";

const Calendrier = () => {
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const categories = [
    { id: 'all', name: 'Tous', icon: Grid, color: 'from-gray-500 to-gray-600' },
    { id: 'solidaire', name: 'Solidaire', icon: Heart, color: 'from-cyan-500 to-blue-600' },
    { id: 'ecologique', name: 'Écologique', icon: Leaf, color: 'from-green-500 to-emerald-600' },
    { id: 'creatif', name: 'Créatif', icon: Palette, color: 'from-indigo-500 to-purple-600' },
    { id: 'educatif', name: 'Éducatif', icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
    { id: 'sportif', name: 'Sportif', icon: Dumbbell, color: 'from-orange-500 to-red-500' }
  ];

  // Événements modernes avec plus de détails
  const events = [
    {
      id: 1,
      date: "25",
      month: "JAN",
      fullDate: "2024-01-25",
      title: "Défi Recyclage - Semaine 3",
      description: "Continuez votre parcours vers le zéro déchet avec des techniques avancées",
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      categoryBg: "from-green-50 to-emerald-50",
      status: "En cours",
      statusColor: "text-green-500",
      time: "09:00",
      duration: "7 jours",
      participants: 156,
      maxParticipants: 200,
      location: "En ligne",
      difficulty: "Moyen",
      points: 200,
      priority: "high",
      progress: 65,
      organizer: "Marie Dubois",
      tags: ["recyclage", "environnement", "communauté"]
    },
    {
      id: 2,
      date: "27",
      month: "JAN",
      fullDate: "2024-01-27",
      title: "Atelier Compost Collectif",
      description: "Apprenez les techniques de compostage urbain avec des experts",
      category: "Éducatif",
      categoryIcon: BookOpen,
      categoryGradient: "from-blue-500 to-indigo-600",
      categoryBg: "from-blue-50 to-indigo-50",
      status: "À venir",
      statusColor: "text-blue-500",
      time: "14:00",
      duration: "2 heures",
      participants: 24,
      maxParticipants: 30,
      location: "Jardin partagé",
      difficulty: "Facile",
      points: 100,
      priority: "medium",
      progress: 0,
      organizer: "Jean Martin",
      tags: ["compost", "jardinage", "atelier"]
    },
    {
      id: 3,
      date: "30",
      month: "JAN",
      fullDate: "2024-01-30",
      title: "Challenge Zéro Déchet",
      description: "Relevez le défi ultime du mode de vie sans déchet",
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      categoryBg: "from-green-50 to-emerald-50",
      status: "À venir",
      statusColor: "text-blue-500",
      time: "08:00",
      duration: "1 semaine",
      participants: 89,
      maxParticipants: 100,
      location: "Partout",
      difficulty: "Difficile",
      points: 300,
      priority: "high",
      progress: 0,
      organizer: "Sophie Chen",
      tags: ["zéro déchet", "lifestyle", "challenge"]
    },
    {
      id: 4,
      date: "02",
      month: "FÉV",
      fullDate: "2024-02-02",
      title: "Création Murale Collaborative",
      description: "Participez à la création d'une œuvre d'art communautaire",
      category: "Créatif",
      categoryIcon: Palette,
      categoryGradient: "from-indigo-500 to-purple-600",
      categoryBg: "from-indigo-50 to-purple-50",
      status: "À venir",
      statusColor: "text-purple-500",
      time: "10:00",
      duration: "4 heures",
      participants: 15,
      maxParticipants: 20,
      location: "Centre culturel",
      difficulty: "Moyen",
      points: 250,
      priority: "medium",
      progress: 0,
      organizer: "Alex Rivera",
      tags: ["art", "collaboration", "créativité"]
    },
    {
      id: 5,
      date: "05",
      month: "FÉV",
      fullDate: "2024-02-05",
      title: "Collecte Solidaire Hiver",
      description: "Aidez les plus démunis en collectant des vêtements chauds",
      category: "Solidaire",
      categoryIcon: Heart,
      categoryGradient: "from-cyan-500 to-blue-600",
      categoryBg: "from-cyan-50 to-blue-50",
      status: "À venir",
      statusColor: "text-cyan-500",
      time: "09:00",
      duration: "3 jours",
      participants: 67,
      maxParticipants: 80,
      location: "Plusieurs points",
      difficulty: "Facile",
      points: 150,
      priority: "high",
      progress: 0,
      organizer: "Claire Moreau",
      tags: ["solidarité", "hiver", "collecte"]
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

        {/* Filtres et contrôles */}
        <div className={`mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Filtres par catégorie */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <category.icon size={16} />
                    <span className="font-medium text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Contrôles de vue */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'month'
                        ? 'bg-white shadow-sm text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Mois
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'week'
                        ? 'bg-white shadow-sm text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Semaine
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Liste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Calendrier + Widgets */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Calendrier principal */}
          <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="calendar-modern">
              <Calendar
                onChange={setDate}
                value={date}
                locale="fr-FR"
                className="w-full"
                tileClassName={({ date: tileDate }) => {
                  const day = tileDate.getDate();
                  if (day === 25) return "bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold";
                  if (day === 27) return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-semibold";
                  if (day === 30) return "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold";
                  if (tileDate.toDateString() === new Date().toDateString()) return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-semibold";
                  return "hover:bg-gray-100 rounded-xl transition-colors duration-200";
                }}
              />
            </div>
          </div>

          {/* Widgets latéraux */}
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
              <h3 className="font-semibold text-gray-800 mb-4">Légende</h3>
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
                <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                  <Plus size={18} />
                  <span>Créer un événement</span>
                </button>

                <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <Filter size={18} />
                  <span>Filtrer les événements</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Section Événements à venir ---- */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-green-500 text-2xl">🕒</span> Événements à venir
          </h2>

          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
              >
                {/* Date */}
                <div className="text-center w-16">
                  <p className="text-2xl font-bold text-gray-800">{event.date}</p>
                  <p className="text-xs text-gray-500">{event.month}</p>
                </div>

                {/* Infos événement */}
                <div className="flex-1 ml-4">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    {event.title}
                    <span
                      className={`${event.categoryColor} text-white text-xs px-2 py-0.5 rounded-full`}
                    >
                      {event.category}
                    </span>
                  </p>
                  <div className="text-gray-500 text-sm flex items-center gap-4 mt-1">
                    <span>🕒 {event.time} • {event.duration}</span>
                    <span>👥 {event.participants} participants</span>
                    <span>📍 {event.location}</span>
                  </div>
                </div>

                {/* Statut et bouton */}
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-medium ${event.statusColor}`}>
                    {event.status}
                  </span>
                  <button className="border border-gray-300 hover:bg-gray-200 transition text-sm rounded-full px-4 py-1">
                    Voir détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;
