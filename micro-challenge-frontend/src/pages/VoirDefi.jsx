import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Target,
  Award,
  Star,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Trophy,
  Leaf,
  Camera,
  FileText,
  Plus,
  Eye,
  ThumbsUp,
  Flag
} from "lucide-react";

const VoirDefi = () => {
  const { defiId } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('apercu');
  const [isParticipating, setIsParticipating] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Données du défi (normalement récupérées via API)
  const defi = {
    id: 1,
    title: "Défi zéro déchet d'une semaine",
    description: "Réduisez vos déchets au maximum pendant une semaine complète. Découvrez des alternatives durables et adoptez des habitudes écologiques qui feront la différence.",
    category: "Écologique",
    categoryIcon: Leaf,
    categoryColor: "from-green-500 to-emerald-500",
    difficulty: "Intermédiaire",
    duration: "7 jours",
    startDate: "20 Jan 2024",
    endDate: "27 Jan 2024",
    participants: 156,
    maxParticipants: 200,
    points: 250,
    status: "En cours",
    progress: 65,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop",
    organizer: {
      name: "Marie Dubois",
      avatar: "MD",
      role: "Coordinatrice Environnement"
    },
    objectives: [
      "Réduire ses déchets de 80% minimum",
      "Utiliser des alternatives réutilisables",
      "Documenter ses progrès quotidiennement",
      "Partager ses astuces avec la communauté"
    ],
    rewards: [
      { type: "Badge", name: "Éco-Warrior", points: 100 },
      { type: "Points", name: "Bonus écologique", points: 150 },
      { type: "Certificat", name: "Champion zéro déchet", points: 0 }
    ],
    stats: {
      completionRate: 78,
      averageScore: 85,
      totalImpact: "2.3 tonnes de déchets évités"
    }
  };

  const handleParticipate = () => {
    setIsParticipating(!isParticipating);
  };

  const handleShare = () => {
    navigator.share({
      title: defi.title,
      text: defi.description,
      url: window.location.href
    }).catch(() => {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(window.location.href);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Bouton retour */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Retour</span>
        </button>

        {/* Header du défi */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Image de couverture */}
            <div className="relative h-64 md:h-80">
              <img 
                src={defi.image} 
                alt={defi.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Badge de catégorie */}
              <div className="absolute top-6 left-6">
                <div className={`flex items-center gap-2 bg-gradient-to-r ${defi.categoryColor} text-white px-4 py-2 rounded-full`}>
                  <defi.categoryIcon size={16} />
                  <span className="font-semibold text-sm">{defi.category}</span>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="absolute top-6 right-6 flex gap-3">
                <button 
                  onClick={handleShare}
                  className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Share2 size={18} />
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors">
                  <Heart size={18} />
                </button>
              </div>

              {/* Informations principales */}
              <div className="absolute bottom-6 left-6 right-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{defi.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="text-sm">{defi.startDate} - {defi.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="text-sm">{defi.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="text-sm">{defi.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} />
                    <span className="text-sm">{defi.points} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progression du défi</span>
                <span className="text-sm font-bold text-gray-900">{defi.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`bg-gradient-to-r ${defi.categoryColor} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${defi.progress}%` }}
                />
              </div>
            </div>

            {/* Actions principales */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleParticipate}
                  className={`flex-1 ${
                    isParticipating 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                      : `bg-gradient-to-r ${defi.categoryColor} text-white hover:shadow-lg`
                  } font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                >
                  {isParticipating ? (
                    <>
                      <CheckCircle size={20} />
                      <span>Déjà inscrit</span>
                    </>
                  ) : (
                    <>
                      <Play size={20} />
                      <span>Participer au défi</span>
                    </>
                  )}
                </button>
                
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  <span>Discussion</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-lg">
            <div className="flex gap-2">
              {[
                { id: 'apercu', label: 'Aperçu', icon: Eye },
                { id: 'objectifs', label: 'Objectifs', icon: Target },
                { id: 'participants', label: 'Participants', icon: Users },
                { id: 'recompenses', label: 'Récompenses', icon: Award }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${defi.categoryColor} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon size={18} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {activeTab === 'apercu' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Description du défi</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{defi.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">{defi.stats.completionRate}%</div>
                    <div className="text-sm text-gray-600">Taux de réussite</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">{defi.stats.averageScore}</div>
                    <div className="text-sm text-gray-600">Score moyen</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">{defi.stats.totalImpact}</div>
                    <div className="text-sm text-gray-600">Impact total</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Organisateur</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {defi.organizer.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{defi.organizer.name}</div>
                      <div className="text-sm text-gray-600">{defi.organizer.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'objectifs' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Objectifs à atteindre</h2>
                <div className="space-y-4">
                  {defi.objectives.map((objective, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`w-8 h-8 bg-gradient-to-r ${defi.categoryColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{objective}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'participants' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Participants ({defi.participants})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "Marie Dubois", avatar: "MD", score: 95, status: "En cours" },
                    { name: "Thomas Martin", avatar: "TM", score: 87, status: "En cours" },
                    { name: "Sophie Laurent", avatar: "SL", score: 92, status: "Terminé" },
                    { name: "Pierre Durand", avatar: "PD", score: 78, status: "En cours" },
                    { name: "Emma Rousseau", avatar: "ER", score: 89, status: "En cours" },
                    { name: "Lucas Bernard", avatar: "LB", score: 83, status: "En cours" }
                  ].map((participant, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {participant.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{participant.name}</div>
                        <div className="text-sm text-gray-600">Score: {participant.score}% • {participant.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'recompenses' && (
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Récompenses disponibles</h2>
                <div className="space-y-4">
                  {defi.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className={`w-12 h-12 bg-gradient-to-r ${defi.categoryColor} rounded-full flex items-center justify-center text-white`}>
                        <Award size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{reward.name}</div>
                        <div className="text-sm text-gray-600">{reward.type}</div>
                      </div>
                      {reward.points > 0 && (
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{reward.points}</div>
                          <div className="text-xs text-gray-600">points</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations rapides */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulté</span>
                  <span className="font-semibold text-gray-800">{defi.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-semibold text-gray-800">{defi.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-semibold text-gray-800">{defi.participants}/{defi.maxParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Points</span>
                  <span className="font-semibold text-gray-800">{defi.points}</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <Flag size={16} />
                  Signaler
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <ThumbsUp size={16} />
                  J'aime
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoirDefi;
