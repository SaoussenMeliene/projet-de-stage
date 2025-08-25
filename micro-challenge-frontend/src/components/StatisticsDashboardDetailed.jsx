import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  Target, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Clock,
  Award,
  BarChart3,
  CheckCircle
} from "lucide-react";

const StatisticsDashboardDetailed = () => {
  const [animatedValues, setAnimatedValues] = useState({
    messages: 0,
    participation: 0,
    defisCompletes: 0,
    points: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  // Données statistiques réelles
  const stats = {
    messages: {
      current: 247,
      change: "+12",
      target: 300,
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    participation: {
      current: 87,
      activeMembers: 6,
      totalMembers: 8,
      icon: Users,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Excellent niveau d'engagement"
    },
    defisCompletes: {
      completed: 12,
      total: 15,
      inProgress: 3,
      remaining: 3,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    points: {
      current: 1450,
      change: "+85",
      target: 2000,
      period: "cette semaine",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      status: "Groupe Performant"
    }
  };

  // Animation des valeurs au chargement
  useEffect(() => {
    setIsVisible(true);
    const animateValue = (targetValue, key) => {
      let current = 0;
      const increment = targetValue / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          current = targetValue;
          clearInterval(timer);
        }
        setAnimatedValues(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 30);
    };

    setTimeout(() => {
      animateValue(stats.messages.current, 'messages');
    }, 200);
    setTimeout(() => {
      animateValue(stats.participation.current, 'participation');
    }, 400);
    setTimeout(() => {
      animateValue(stats.defisCompletes.completed, 'defisCompletes');
    }, 600);
    setTimeout(() => {
      animateValue(stats.points.current, 'points');
    }, 800);
  }, []);

  return (
    <div className="px-8 py-6">
      {/* Titre de la section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistiques</h2>
        <p className="text-gray-600">Vue d'ensemble de vos performances et activités</p>
      </div>

      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Messages */}
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
          isVisible ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stats.messages.color} flex items-center justify-center shadow-lg`}>
              <stats.messages.icon className="text-white w-7 h-7" />
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                <TrendingUp size={12} />
                {stats.messages.change}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gray-800">{animatedValues.messages}</h3>
            <p className="text-sm font-semibold text-gray-700">Messages</p>
            
            {/* Barre de progression */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Actuel</span>
                <span>Objectif: {stats.messages.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${stats.messages.color} rounded-full transition-all duration-1500`}
                  style={{
                    width: `${Math.min((animatedValues.messages / stats.messages.target) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Participation Active */}
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
          isVisible ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stats.participation.color} flex items-center justify-center shadow-lg`}>
              <stats.participation.icon className="text-white w-7 h-7" />
            </div>
            <div className="text-right">
              <span className="text-green-500 text-xs font-bold">{stats.participation.activeMembers}/{stats.participation.totalMembers} membres actifs</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gray-800">{animatedValues.participation}%</h3>
            <p className="text-sm font-semibold text-gray-700">Participation active</p>
            <p className="text-xs text-green-600 font-medium">{stats.participation.description}</p>
            
            {/* Indicateur circulaire */}
            <div className="mt-4 flex justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray={`${animatedValues.participation}, 100`}
                    className="transition-all duration-1500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="text-green-500 w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Défis Complétés */}
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
          isVisible ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stats.defisCompletes.color} flex items-center justify-center shadow-lg`}>
              <stats.defisCompletes.icon className="text-white w-7 h-7" />
            </div>
            <div className="text-right">
              <span className="text-orange-500 text-xs font-bold">{stats.defisCompletes.inProgress} en cours</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-gray-800">{animatedValues.defisCompletes}</h3>
              <span className="text-lg text-gray-500">/{stats.defisCompletes.total}</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Défis complétés</p>
            <p className="text-xs text-gray-600">{stats.defisCompletes.remaining} défis restants ce mois</p>
            
            {/* Barre de progression segmentée */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                {Array.from({ length: stats.defisCompletes.total }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 mx-[1px] rounded-full ${
                      i < animatedValues.defisCompletes
                        ? 'bg-purple-500'
                        : i < stats.defisCompletes.completed + stats.defisCompletes.inProgress
                        ? 'bg-orange-300'
                        : 'bg-gray-200'
                    } transition-all duration-300`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Complétés</span>
                <span>En cours</span>
                <span>Restants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Points Totaux */}
        <div className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${
          isVisible ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'
        }`} style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stats.points.color} flex items-center justify-center shadow-lg`}>
              <stats.points.icon className="text-white w-7 h-7" />
            </div>
            <div className="text-right">
              <span className="text-green-500 text-sm font-bold flex items-center gap-1">
                <TrendingUp size={12} />
                {stats.points.change} {stats.points.period}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-gray-800">{animatedValues.points.toLocaleString()}</h3>
            <p className="text-sm font-semibold text-gray-700">Points totaux</p>
            <p className="text-xs text-yellow-600 font-medium">{stats.points.status}</p>
            
            {/* Barre de progression vers l'objectif */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Actuel</span>
                <span>Objectif: {stats.points.target.toLocaleString()} points</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-full bg-gradient-to-r ${stats.points.color} rounded-full transition-all duration-1500 relative overflow-hidden`}
                  style={{
                    width: `${Math.min((animatedValues.points / stats.points.target) * 100, 100)}%`
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default StatisticsDashboardDetailed;