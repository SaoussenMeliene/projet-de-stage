import { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import {
  Users,
  Target,
  Award,
  TrendingUp,
  Plus,
  Settings,
  UserPlus,
  Calendar,
  BarChart3,
  Shield,
  Database,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from "lucide-react";

const AdminDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    checkAdminAccess();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== 'admin') {
          alert('Accès refusé - Droits administrateur requis');
          window.location.href = '/accueil';
          return;
        }
        setUserRole(data.user.role);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  // Statistiques admin
  const adminStats = [
    {
      icon: Users,
      title: "Utilisateurs totaux",
      value: "156",
      change: "+12",
      color: "from-blue-500 to-cyan-500",
      description: "Collaborateurs actifs"
    },
    {
      icon: Target,
      title: "Défis créés",
      value: "24",
      change: "+3",
      color: "from-green-500 to-emerald-500",
      description: "Ce mois-ci"
    },
    {
      icon: Activity,
      title: "Groupes actifs",
      value: "18",
      change: "+5",
      color: "from-purple-500 to-pink-500",
      description: "Avec participants"
    },
    {
      icon: Award,
      title: "Points distribués",
      value: "12.5K",
      change: "+2.1K",
      color: "from-yellow-500 to-orange-500",
      description: "Total des récompenses"
    }
  ];

  // Actions rapides admin
  const quickActions = [
    {
      icon: Plus,
      title: "Créer un défi",
      description: "Lancer un nouveau challenge",
      color: "from-green-500 to-emerald-500",
      action: () => console.log("Créer défi")
    },
    {
      icon: UserPlus,
      title: "Gérer les utilisateurs",
      description: "Ajouter ou modifier des comptes",
      color: "from-blue-500 to-indigo-500",
      action: () => console.log("Gérer utilisateurs")
    },
    {
      icon: Settings,
      title: "Configuration",
      description: "Paramètres de l'application",
      color: "from-purple-500 to-pink-500",
      action: () => console.log("Configuration")
    },
    {
      icon: BarChart3,
      title: "Rapports",
      description: "Statistiques détaillées",
      color: "from-orange-500 to-red-500",
      action: () => console.log("Rapports")
    }
  ];

  // Activités récentes
  const recentActivities = [
    {
      icon: CheckCircle,
      title: "Nouveau défi validé",
      description: "Challenge Zéro Déchet approuvé",
      time: "Il y a 2h",
      color: "text-green-500"
    },
    {
      icon: UserPlus,
      title: "Nouvel utilisateur",
      description: "marie.dupont@satoripop.com rejoint",
      time: "Il y a 4h",
      color: "text-blue-500"
    },
    {
      icon: AlertCircle,
      title: "Groupe inactif",
      description: "Équipe Marketing - 7 jours sans activité",
      time: "Il y a 1j",
      color: "text-yellow-500"
    },
    {
      icon: Award,
      title: "Récompense distribuée",
      description: "500 points attribués à l'équipe Dev",
      time: "Il y a 2j",
      color: "text-purple-500"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Admin */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Effets de fond */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Shield className="text-white w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
                  <p className="text-red-100">Gestion complète de la plateforme Micro-Challenges</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-3">
                  <Database className="text-white w-5 h-5" />
                  <span className="text-white font-medium">Accès administrateur confirmé</span>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">ADMIN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {adminStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center`}>
                  <stat.icon className="text-white w-6 h-6" />
                </div>
                <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 font-medium mb-1">{stat.title}</p>
              <p className="text-gray-500 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className={`mb-8 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-left"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Activités récentes</h2>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center gap-2">
                <Eye size={16} />
                <span>Voir tout</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center ${activity.color}`}>
                    <activity.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{activity.title}</h4>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={14} />
                    <span>{activity.time}</span>
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

export default AdminDashboard;
