import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Leaf,
  Palette,
  Clock,
  Calendar,
  Users,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Award,
  ChevronRight
} from "lucide-react";

export default function DefisRecentsModern() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const recentChallenges = [
    {
      id: 1,
      category: "Solidaire",
      categoryIcon: Heart,
      categoryGradient: "from-cyan-500 to-blue-600",
      categoryBg: "from-cyan-50 to-blue-50",
      duration: "7 jours",
      title: "Collecte de vêtements pour l'hiver",
      description:
        "Organisez une collecte de vêtements chauds pour les personnes dans le besoin de votre quartier.",
      date: "15 Jan - 22 Jan",
      participants: 12,
      popularity: "Très populaire",
      difficulty: "Facile",
      points: 150,
      status: "En cours",
      progress: 75,
    },
    {
      id: 2,
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      categoryBg: "from-green-50 to-emerald-50",
      duration: "7 jours",
      title: "Défi zéro déchet d'une semaine",
      description:
        "Relevez le défi de réduire vos déchets au maximum pendant une semaine complète.",
      date: "20 Jan - 27 Jan",
      participants: 8,
      popularity: "Tendance",
      difficulty: "Moyen",
      points: 200,
      status: "Nouveau",
      progress: 45,
    },
    {
      id: 3,
      category: "Créatif",
      categoryIcon: Palette,
      categoryGradient: "from-indigo-500 to-purple-600",
      categoryBg: "from-indigo-50 to-purple-50",
      duration: "8 jours",
      title: "Création d'un mur d'expression",
      description:
        "Concevez et réalisez un mur d'expression créatif pour égayer l'espace de travail.",
      date: "25 Jan - 1 Fév",
      participants: 5,
      popularity: "Nouveau",
      difficulty: "Difficile",
      points: 300,
      status: "Bientôt",
      progress: 20,
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-12">
      {/* Titre avec animation */}
      <div className={`text-center mt-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Défis récents
          </h2>
        </div>
        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Découvrez les derniers défis proposés par notre communauté et rejoignez
          l'aventure collaborative pour un impact positif.
        </p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span>+25% cette semaine</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span>247 participants actifs</span>
          </div>
        </div>
      </div>

      {/* Grille des cartes modernes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-16">
        {recentChallenges.map((challenge, index) => (
          <div
            key={challenge.id}
            onClick={() => navigate(`/defi/${challenge.id}`)}
            className={`group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4 hover:scale-105 cursor-pointer overflow-hidden border border-gray-100 ${
              isVisible ? 'animate-slideInUp' : 'opacity-0 translate-y-8'
            }`}
            style={{
              animationDelay: `${index * 200}ms`,
            }}
          >
            {/* Effet de brillance */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
            
            {/* Gradient de fond */}
            <div className={`absolute inset-0 bg-gradient-to-br ${challenge.categoryBg} opacity-30`}></div>
            
            {/* Header coloré */}
            <div className="relative h-48 overflow-hidden rounded-t-3xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.categoryGradient} opacity-90`}></div>
              <div className="absolute inset-0 bg-black/20"></div>
              
              {/* Icône de catégorie */}
              <div className="absolute top-4 left-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <challenge.categoryIcon className="text-white w-6 h-6" />
                </div>
              </div>
              
              {/* Badge de statut */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {challenge.status}
                </span>
              </div>
              
              {/* Badge de popularité */}
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Star className="text-yellow-300 w-4 h-4 fill-current" />
                  <span className="text-white text-xs font-medium">{challenge.popularity}</span>
                </div>
              </div>
              
              {/* Points */}
              <div className="absolute bottom-4 right-4">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Award className="text-yellow-300 w-4 h-4" />
                  <span className="text-white text-xs font-bold">{challenge.points} pts</span>
                </div>
              </div>
            </div>

            {/* Contenu de la carte */}
            <div className="relative p-6">
              {/* Header avec catégorie et durée */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${challenge.categoryGradient} text-white`}>
                  {challenge.category}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.duration}</span>
                </div>
              </div>

              {/* Titre */}
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-gray-900 transition-colors duration-300 line-clamp-2">
                {challenge.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                {challenge.description}
              </p>

              {/* Barre de progression */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Progression</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-full bg-gradient-to-r ${challenge.categoryGradient} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Informations */}
              <div className="flex items-center justify-between text-gray-500 text-sm mb-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{challenge.participants} participants</span>
                </div>
              </div>
              
              {/* Bouton d'action */}
              <button className={`w-full bg-gradient-to-r ${challenge.categoryGradient} hover:shadow-lg text-white font-semibold py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group-hover:shadow-xl`}>
                <span>Participer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Effet de bordure au hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${challenge.categoryGradient} p-[2px]`}>
              <div className="w-full h-full bg-white rounded-3xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton Voir tous les défis modernisé */}
      <div className="flex justify-center mb-16">
        <button className="group bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3">
          <span>Voir tous les défis</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Bannière finale ultra-moderne */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 sm:p-16 text-center overflow-hidden shadow-2xl">
        {/* Effets de fond */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Contenu */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Zap className="text-white w-8 h-8" />
            </div>
          </div>
          
          <h3 className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Prêt à faire la différence ?
          </h3>
          
          <p className="mb-8 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed text-white/90">
            Rejoignez notre communauté de <span className="font-semibold text-yellow-300">247 participants actifs</span> et 
            participez à des actions concrètes pour un monde meilleur, une micro-action à la fois.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-white text-purple-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2">
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
              <span>En savoir plus</span>
            </button>
          </div>
          
          {/* Statistiques en bas */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-300">156</div>
              <div className="text-sm text-white/80">Défis réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">89</div>
              <div className="text-sm text-white/80">Badges débloqués</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">247</div>
              <div className="text-sm text-white/80">Participants</div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
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
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
