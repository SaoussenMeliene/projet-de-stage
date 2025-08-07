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
  MoreHorizontal
} from "lucide-react";

export default function ActiveChallengesModern() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const challenges = [
    {
      id: 1,
      title: "Défi zéro déchet d'une semaine",
      description: "Réduisez vos déchets au maximum pendant une semaine complète et documentez votre progression.",
      category: "Écologique",
      categoryIcon: Leaf,
      categoryGradient: "from-green-500 to-emerald-600",
      categoryBg: "from-green-50 to-emerald-50",
      status: "En cours",
      statusColor: "green",
      days: 7,
      daysLeft: 3,
      progress: 65,
      participants: 8,
      date: "20 Jan - 27 Jan",
      points: 200,
      difficulty: "Moyen",
      priority: "high",
      tasks: [
        { name: "Audit des déchets", completed: true },
        { name: "Alternatives durables", completed: true },
        { name: "Suivi quotidien", completed: false },
        { name: "Rapport final", completed: false }
      ]
    },
    {
      id: 2,
      title: "Création d'un mur d'expression",
      description: "Concevez et réalisez un mur d'expression créatif pour égayer l'espace de travail commun.",
      category: "Créatif",
      categoryIcon: Palette,
      categoryGradient: "from-indigo-500 to-purple-600",
      categoryBg: "from-indigo-50 to-purple-50",
      status: "En cours",
      statusColor: "blue",
      days: 8,
      daysLeft: 5,
      progress: 30,
      participants: 5,
      date: "25 Jan - 1 Fév",
      points: 300,
      difficulty: "Difficile",
      priority: "medium",
      tasks: [
        { name: "Brainstorming", completed: true },
        { name: "Design concept", completed: false },
        { name: "Matériaux", completed: false },
        { name: "Réalisation", completed: false }
      ]
    },
    {
      id: 3,
      title: "Collecte de vêtements solidaire",
      description: "Organisez une collecte de vêtements chauds pour les personnes dans le besoin de votre quartier.",
      category: "Solidaire",
      categoryIcon: Heart,
      categoryGradient: "from-cyan-500 to-blue-600",
      categoryBg: "from-cyan-50 to-blue-50",
      status: "À venir",
      statusColor: "yellow",
      days: 10,
      daysLeft: 7,
      progress: 15,
      participants: 12,
      date: "5 Fév - 15 Fév",
      points: 250,
      difficulty: "Facile",
      priority: "low",
      tasks: [
        { name: "Planification", completed: true },
        { name: "Communication", completed: false },
        { name: "Collecte", completed: false },
        { name: "Distribution", completed: false }
      ]
    }
  ];

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
            <span>Progression moyenne: 37%</span>
          </div>
        </div>
      </div>

      {/* Grille des défis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {challenges.map((challenge, index) => (
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
                <button className={`flex-1 bg-gradient-to-r ${challenge.categoryGradient} hover:shadow-lg text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm`}>
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-xl transition-colors duration-200">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Effet de bordure au hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${challenge.categoryGradient} p-[2px]`}>
              <div className="w-full h-full bg-white rounded-3xl"></div>
            </div>
          </div>
        ))}
      </div>

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
