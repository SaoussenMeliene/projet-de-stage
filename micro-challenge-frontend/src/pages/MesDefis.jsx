import React, { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import DashboardChallengeModern from "../components/DashboardChallengeModern";
import ActiveChallengesModern from "../components/ActiveChallengesModern";
import { Target, TrendingUp, Award, Users, Plus, Zap } from "lucide-react";

const MesDefis = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Statistiques personnelles
  const personalStats = [
    {
      icon: Target,
      value: 8,
      label: "Défis actifs",
      gradient: "from-blue-500 to-cyan-500",
      change: "+2"
    },
    {
      icon: Award,
      value: 15,
      label: "Badges gagnés",
      gradient: "from-yellow-500 to-orange-500",
      change: "+3"
    },
    {
      icon: TrendingUp,
      value: 87,
      label: "Score moyen",
      gradient: "from-green-500 to-emerald-500",
      change: "+12%"
    },
    {
      icon: Users,
      value: 24,
      label: "Collaborations",
      gradient: "from-purple-500 to-pink-500",
      change: "+5"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      {/* Header */}
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section avec statistiques personnelles */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Effets de fond */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Zap className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold">Tableau de bord personnel</h1>
                      <p className="text-blue-100">Suivez votre progression et gérez vos défis</p>
                    </div>
                  </div>
                </div>

                <button className="group bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-semibold">Nouveau défi</span>
                </button>
              </div>

              {/* Statistiques en grille */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {personalStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                        <stat.icon className="text-white w-4 h-4" />
                      </div>
                      <span className="text-green-300 text-sm font-semibold">{stat.change}</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-100 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section de gestion des défis */}
        <DashboardChallengeModern />

        {/* Section défis actifs */}
        <ActiveChallengesModern />

        {/* Section recommandations */}
        <div className={`mt-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Target className="text-white w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Défis recommandés</h2>
                <p className="text-gray-600 text-sm">Découvrez de nouveaux défis adaptés à vos intérêts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Défi lecture 30 jours", category: "Éducatif", participants: 156 },
                { title: "Challenge sport quotidien", category: "Sportif", participants: 89 },
                { title: "Méditation mindfulness", category: "Bien-être", participants: 234 }
              ].map((rec, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <h3 className="font-semibold text-gray-800 mb-2">{rec.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{rec.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{rec.participants} participants</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors duration-200">
                      Rejoindre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesDefis;