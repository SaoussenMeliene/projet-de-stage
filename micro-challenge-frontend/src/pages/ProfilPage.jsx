import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import {
  User,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Target,
  Award,
  Users,
  Activity,
  CheckCircle,
  Camera,
  Calendar,
  Star,
  Zap,
  Trophy,
  Eye
} from "lucide-react";

const ProfilPage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    profileImage: ''
  });

  // Fonction pour obtenir les données par défaut
  const getDefaultUserData = () => {
    return {
      firstName: "Utilisateur",
      lastName: "",
      email: "email@example.com",
      phone: "",
      bio: "Aucune biographie renseignée",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    };
  };





  useEffect(() => {
    // Vérifier l'authentification au chargement
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers la page de connexion si pas de token
      navigate('/login');
      return;
    }



    const getUserData = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const currentToken = localStorage.getItem('token');

        // Si pas de token, retourner données par défaut
        if (!currentToken) {
          localStorage.removeItem('user');
          return getDefaultUserData();
        }

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          const profileImageUrl = parsedUser.profileImage ?
            (parsedUser.profileImage.startsWith('http') ? parsedUser.profileImage : `http://localhost:5000${parsedUser.profileImage}`) :
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face";

          return {
            firstName: parsedUser.firstName || "Utilisateur",
            lastName: parsedUser.lastName || "",
            email: parsedUser.email || "email@example.com",
            phone: parsedUser.phone || "",
            bio: parsedUser.bio || "Aucune biographie renseignée",
            profileImage: profileImageUrl,
            createdAt: parsedUser.createdAt,
            updatedAt: parsedUser.updatedAt
          };
        }
        
        // Données par défaut si aucun utilisateur connecté
        return getDefaultUserData();
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        return getDefaultUserData();
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Vérifier si le token a changé depuis la dernière fois
          const storedToken = localStorage.getItem('lastTokenUsed');
          if (storedToken && storedToken !== token) {
            localStorage.removeItem('user');
          }

          const response = await fetch('http://localhost:5000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const apiUser = await response.json();

            const userData = {
              firstName: apiUser.firstName || apiUser.username?.split(' ')[0] || "Utilisateur",
              lastName: apiUser.lastName || apiUser.username?.split(' ').slice(1).join(' ') || "",
              email: apiUser.email || "email@example.com",
              phone: apiUser.phone || "",
              bio: apiUser.bio || "Passionné(e) par les défis écologiques et solidaires",
              profileImage: apiUser.profileImage ?
                (apiUser.profileImage.startsWith('http') ? apiUser.profileImage : `http://localhost:5000${apiUser.profileImage}`) :
                "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
              createdAt: apiUser.createdAt,
              updatedAt: apiUser.updatedAt
            };

            // Mettre à jour localStorage avec les données fraîches de l'API
            localStorage.setItem('user', JSON.stringify(apiUser));
            localStorage.setItem('lastTokenUsed', token);

            setUser(userData);
            setFormData(userData);
            setLoading(false);
            return;
          } else {
            console.log('⚠️ Erreur API:', response.status, response.statusText);
            const errorText = await response.text();
            console.log('⚠️ Détails de l\'erreur:', errorText);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        // Rediriger vers la page de connexion si pas de token
        navigate('/login');
        return;
      }

      // Fallback vers localStorage si l'API échoue
      const userData = getUserData();
      setUser(userData);
      setFormData(userData);
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Vous devez être connecté pour modifier votre profil');
        return;
      }

      // Préparer les données à envoyer
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio
      };

      console.log('📤 Envoi des données de profil:', updateData);

      // Envoyer à l'API
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profil mis à jour:', data);

        // Construire l'URL complète de l'image si elle existe
        const updatedUser = {
          ...data.user,
          profileImage: data.user.profileImage ?
            (data.user.profileImage.startsWith('http') ? data.user.profileImage : `http://localhost:5000${data.user.profileImage}`) :
            user.profileImage
        };

        // Mettre à jour l'état local
        setUser(updatedUser);
        setFormData(updatedUser);

        // Mettre à jour localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedStoredUser = {
          ...storedUser,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          bio: data.user.bio,
          profileImage: data.user.profileImage
        };
        localStorage.setItem('user', JSON.stringify(updatedStoredUser));

        setEditing(false);
        alert('Profil mis à jour avec succès !');
      } else {
        const errorData = await response.json();
        alert(`Erreur lors de la mise à jour: ${errorData.msg}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du profil');
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setUploadingAvatar(true);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Vous devez être connecté pour changer votre image de profil');
          setUploadingAvatar(false);
          return;
        }

        // Créer FormData pour l'upload
        const formDataUpload = new FormData();
        formDataUpload.append('profileImage', file);

        // Envoyer à l'API
        const response = await fetch('http://localhost:5000/api/users/profile-image', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formDataUpload
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Image de profil uploadée:', data);

          // Construire l'URL complète de l'image
          const imageUrl = `http://localhost:5000${data.profileImage}`;

          // Mettre à jour l'état local
          const newUser = { ...user, profileImage: imageUrl };
          const newFormData = { ...formData, profileImage: imageUrl };
          setUser(newUser);
          setFormData(newFormData);

          // Mettre à jour localStorage avec les nouvelles données
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          const updatedStoredUser = { ...storedUser, profileImage: data.profileImage };
          localStorage.setItem('user', JSON.stringify(updatedStoredUser));

          alert('Image de profil mise à jour avec succès !');
        } else {
          const errorData = await response.json();
          alert(`Erreur lors de l'upload: ${errorData.msg}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de l\'image');
      } finally {
        setUploadingAvatar(false);
      }
    }
  };





  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderDashboard />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-2xl">
                  {uploadingAvatar ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      <span className="text-xs">Upload...</span>
                    </div>
                  ) : user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Image de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-white/70" />
                  )}
                </div>

                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
                
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Utilisateur'}
                </h1>
                <p className="text-white/90 flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Mail size={18} />
                  {user?.email || 'Email non renseigné'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Date inconnue'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>Dernière connexion: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('fr-FR') : 'Inconnue'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(!editing)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all border border-white/30"
                >
                  <Edit3 size={18} />
                  {editing ? 'Annuler' : 'Modifier le profil'}
                </button>


              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Trophy className="text-yellow-300" size={16} />
                <span className="text-sm font-medium">Expert Écologique</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Star className="text-yellow-300" size={16} />
                <span className="text-sm font-medium">Top Contributeur</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Zap className="text-yellow-300" size={16} />
                <span className="text-sm font-medium">Série de 7 jours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100">
            {[
              { id: 'profile', label: 'Profil', icon: User },
              { id: 'activity', label: 'Activité', icon: Activity },
              { id: 'achievements', label: 'Réalisations', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations personnelles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                {editing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Prénom"
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Nom"
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                    {`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Non renseigné'}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {user?.email || 'Non renseigné'}
                </div>
              </div>
            </div>

            {/* Téléphone - Pleine largeur */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800">
                  {formData.phone || 'Non renseigné'}
                </div>
              )}
            </div>

            {/* Biographie - Pleine largeur */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Biographie</label>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Parlez-nous de vous..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 min-h-[100px]">
                  {formData.bio || 'Non renseigné'}
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Save size={16} />
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: 42, label: "Défis complétés", color: "text-green-600", bgColor: "bg-green-50", icon: CheckCircle },
                { value: "12 500", label: "Points totaux", color: "text-yellow-600", bgColor: "bg-yellow-50", icon: Star },
                { value: 8, label: "Badges obtenus", color: "text-purple-600", bgColor: "bg-purple-50", icon: Award },
                { value: 3, label: "Groupes rejoints", color: "text-blue-600", bgColor: "bg-blue-50", icon: Users }
              ].map((stat, index) => (
                <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-gray-100`}>
                  <div className="flex items-center gap-3 mb-3">
                    <stat.icon className={stat.color} size={24} />
                    <div className={`text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Activité récente */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-green-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Activité récente</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Défi Recyclage complété",
                    time: "Il y a 2 heures",
                    points: "+150 points",
                    icon: CheckCircle,
                    color: "text-green-500"
                  },
                  {
                    title: "Badge \"Eco-Warrior\" débloqué",
                    time: "Il y a 1 jour",
                    points: "+500 points",
                    icon: Award,
                    color: "text-yellow-500"
                  },
                  {
                    title: "Rejoint le groupe \"Développeurs Verts\"",
                    time: "Il y a 3 jours",
                    points: "",
                    icon: Users,
                    color: "text-blue-500"
                  },
                  {
                    title: "Défi Transport Vert terminé",
                    time: "Il y a 5 jours",
                    points: "+200 points",
                    icon: CheckCircle,
                    color: "text-green-500"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                      <activity.icon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{activity.title}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{activity.time}</span>
                        {activity.points && (
                          <span className="text-sm font-medium text-green-600">{activity.points}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Objectifs en cours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="text-blue-500" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Objectifs en cours</h2>
              </div>

              <div className="space-y-6">
                {[
                  { name: "Streak Master", description: "7 jours consécutifs", progress: 85, color: "bg-green-500" },
                  { name: "Social Butterfly", description: "Inviter 5 amis", progress: 60, color: "bg-blue-500" },
                  { name: "Point Collector", description: "Atteindre 15k points", progress: 83, color: "bg-purple-500" }
                ].map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">{goal.name}</h3>
                      <span className="text-sm font-medium text-gray-600">{goal.progress}%</span>
                    </div>
                    <p className="text-sm text-gray-500">{goal.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${goal.color} transition-all duration-500`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* Badges obtenus */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Award className="text-yellow-600" size={20} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Badges obtenus</h2>
                  <p className="text-gray-600">Vos accomplissements et récompenses</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Eco-Warrior",
                    description: "10 défis écologiques complétés",
                    earned: true,
                    color: "green",
                    icon: "🌱",
                    date: "15 Mars 2024"
                  },
                  {
                    name: "Social Butterfly",
                    description: "Inviter 5 amis",
                    earned: true,
                    color: "blue",
                    icon: "🦋",
                    date: "10 Mars 2024"
                  },
                  {
                    name: "First Steps",
                    description: "Premier défi complété",
                    earned: true,
                    color: "purple",
                    icon: "👶",
                    date: "1 Mars 2024"
                  },
                  {
                    name: "Streak Master",
                    description: "7 jours consécutifs",
                    earned: false,
                    color: "orange",
                    icon: "🔥",
                    progress: 85
                  },
                  {
                    name: "Point Collector",
                    description: "15k points atteints",
                    earned: false,
                    color: "indigo",
                    icon: "💎",
                    progress: 83
                  },
                  {
                    name: "Team Player",
                    description: "Participer à 10 défis de groupe",
                    earned: false,
                    color: "pink",
                    icon: "🤝",
                    progress: 30
                  }
                ].map((badge, index) => (
                  <div key={index} className={`p-6 rounded-2xl border-2 transition-all ${
                    badge.earned
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                        badge.earned ? 'bg-green-500' : 'bg-gray-400'
                      }`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                      </div>
                    </div>

                    {badge.earned ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={16} />
                        <span className="text-xs text-green-600 font-medium">Obtenu le {badge.date}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium">{badge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${badge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Statistiques détaillées */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques détaillées</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance mensuelle</h3>
                  <div className="space-y-4">
                    {[
                      { month: "Mars 2024", defis: 15, points: 3200 },
                      { month: "Février 2024", defis: 12, points: 2800 },
                      { month: "Janvier 2024", defis: 10, points: 2100 }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-800">{stat.month}</h4>
                          <p className="text-sm text-gray-600">{stat.defis} défis complétés</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{stat.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Catégories favorites</h3>
                  <div className="space-y-4">
                    {[
                      { category: "Écologie", percentage: 45, color: "bg-green-500" },
                      { category: "Transport", percentage: 30, color: "bg-blue-500" },
                      { category: "Alimentation", percentage: 25, color: "bg-orange-500" }
                    ].map((cat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">{cat.category}</span>
                          <span className="text-sm text-gray-600">{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${cat.color} transition-all duration-500`}
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
};

export default ProfilPage;
