import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Award,
  Target,
  TrendingUp,
  Settings
} from 'lucide-react';
import HeaderDashboard from '../components/HeaderDashboard';
import UserAvatar from '../components/UserAvatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || ''
        });
      }

      if (token) {
        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const userData = await response.json();
          console.log("👤 Données utilisateur récupérées:", userData);
          setUser(userData);
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            username: userData.username || '',
            email: userData.email || ''
          });
          // Mettre à jour le localStorage avec les nouvelles données
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      toast.error("Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEditing(false);
        toast.success("Profil mis à jour avec succès !");
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
    setEditing(false);
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.email?.split('@')[0] || 'Utilisateur';
  };

  const getJoinDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return 'Date inconnue';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f9f6]">
        <HeaderDashboard />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      <ToastContainer />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header harmonisé avec le dashboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          {/* Banner avec dégradé cohérent */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            {/* Bouton d'édition style dashboard */}
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {/* Contenu principal style dashboard */}
          <div className="p-6 -mt-16 relative">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6">
              {/* Avatar style dashboard */}
              <div className="relative">
                <UserAvatar
                  name={getDisplayName()}
                  email={user?.email}
                  profileImage={user?.profileImage}
                  size="xl"
                  showBorder={true}
                  className="border-4 border-white shadow-xl"
                />
                {/* Badge de statut harmonisé */}
                <div className="absolute -bottom-1 -right-1 bg-green-500 p-2 rounded-full shadow-lg border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Informations style dashboard */}
              <div className="flex-1 lg:mb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {getDisplayName()}
                    </h1>
                    <p className="text-gray-600 mb-3 flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      {user?.email}
                    </p>

                    {/* Badges style dashboard */}
                    <div className="flex flex-wrap gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user?.role === 'admin'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        <Shield className="w-4 h-4 mr-1" />
                        {user?.role === 'admin' ? 'Administrateur' : 'Collaborateur'}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Calendar className="w-4 h-4 mr-1" />
                        Membre depuis {getJoinDate()}
                      </span>
                    </div>
                  </div>

                  {/* Métriques style dashboard */}
                  <div className="flex gap-4">
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 min-w-[80px] border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">1,250</div>
                      <div className="text-xs text-blue-500 font-medium">Points</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 min-w-[80px] border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-xs text-purple-500 font-medium">Défis</div>
                    </div>
                    <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 min-w-[80px] border border-green-200">
                      <div className="text-2xl font-bold text-green-600">5</div>
                      <div className="text-xs text-green-500 font-medium">Badges</div>
                    </div>
                  </div>
                </div>

                {/* Barre de progression style dashboard */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Niveau Expert</span>
                    <span className="text-sm text-gray-500">75%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>

              {/* Actions d'édition style dashboard */}
              {editing && (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Save size={16} />
                    Sauvegarder
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <X size={16} />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Informations personnelles</h2>
            </div>

            <div className="space-y-4">
              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Votre prénom"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                    {user?.firstName || 'Non renseigné'}
                  </p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Votre nom"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                    {user?.lastName || 'Non renseigné'}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Votre nom d'utilisateur"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                    {user?.username || 'Non renseigné'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
              </div>


            </div>
          </div>

          {/* Statistiques et activité */}
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="text-white" size={18} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Statistiques</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Défis</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">12</p>
                  <p className="text-xs text-blue-700">Complétés</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 cursor-pointer border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-800">Points</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">1,250</p>
                  <p className="text-xs text-green-700">Total gagné</p>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                  <Settings className="text-white" size={18} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Actions rapides</h2>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-left">
                  Changer mon mot de passe
                </button>

                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-left">
                  Voir mes défis
                </button>

                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 text-left">
                  Paramètres de notification
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilPage;
