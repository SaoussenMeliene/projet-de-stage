import React, { useState, useEffect } from "react";
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
  CheckCircle
} from "lucide-react";

const Recompenses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [userPoints, setUserPoints] = useState(1250);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const badges = [
    {
      id: 1,
      name: "Eco-Warrior",
      description: "Complétez 10 défis écologiques",
      icon: Trophy,
      color: "from-yellow-400 to-orange-500",
      progress: 100,
      unlocked: true,
      requirement: "10 défis écologiques"
    },
    {
      id: 2,
      name: "Recycleur Pro",
      description: "Triez 100 objets",
      icon: Recycle,
      color: "from-gray-400 to-gray-600",
      progress: 100,
      unlocked: true,
      requirement: "100 objets triés"
    },
    {
      id: 3,
      name: "Team Player",
      description: "Participez à 5 défis de groupe",
      icon: Users,
      color: "from-green-400 to-emerald-500",
      progress: 60,
      unlocked: false,
      requirement: "5 défis de groupe",
      current: 3,
      total: 5
    },
    {
      id: 4,
      name: "Zéro Déchet Master",
      description: "Évitez le plastique pendant 30 jours",
      icon: Leaf,
      color: "from-green-500 to-green-700",
      progress: 20,
      unlocked: false,
      requirement: "30 jours sans plastique",
      current: 6,
      total: 30
    }
  ];

  const rewards = [
    {
      id: 1,
      name: "Gourde écologique",
      points: 500,
      image: "🍃",
      category: "Accessoires",
      available: true
    },
    {
      id: 2,
      name: "Bon d'achat bio 20€",
      points: 1000,
      image: "🛒",
      category: "Shopping",
      available: true
    },
    {
      id: 3,
      name: "Plante de bureau",
      points: 750,
      image: "🌱",
      category: "Bureau",
      available: true
    },
    {
      id: 4,
      name: "Kit zéro déchet",
      points: 1500,
      image: "♻️",
      category: "Lifestyle",
      available: false
    }
  ];

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

                        {/* Progress Bar */}
                        {!badge.unlocked && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>{badge.current || 0}/{badge.total}</span>
                              <span>{badge.progress}% complété</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${badge.color}`}
                                style={{ width: `${badge.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {badge.unlocked && (
                          <div className="flex items-center justify-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Débloqué</span>
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
              {rewards.map((reward) => (
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

                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-800">{reward.points}</span>
                      <span className="text-sm text-gray-500">points</span>
                    </div>

                    <button
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                        reward.available && userPoints >= reward.points
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!reward.available || userPoints < reward.points}
                    >
                      {!reward.available
                        ? 'Bientôt disponible'
                        : userPoints >= reward.points
                          ? 'Échanger'
                          : `${reward.points - userPoints} points manquants`
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gagnez plus de points !</h3>
              <p className="text-gray-600 mb-4">Participez à des défis pour débloquer plus de récompenses</p>
              <button
                onClick={() => window.location.href = '/mes-defis'}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                Voir les défis
              </button>
            </div>
          </div>
        </div>

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

            {/* Points gagnés ce mois */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">+450</div>
                  <div className="text-sm text-gray-500">Points ce mois</div>
                </div>
              </div>
            </div>

            {/* Rang */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">#12</div>
                  <div className="text-sm text-gray-500">Classement global</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recompenses;