import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import { fetchUserStats } from "../services/userStatsService";
import {
  User, Mail, Phone, Edit3, Save, X, Target, Users,
  CheckCircle, Camera, Calendar, Star, Zap, Trophy
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

/** ===== Helpers ===== **/
// Utiliser le proxy Vite au lieu d'appels directs
const API_BASE = "/api";

function buildImageUrl(src) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;  // URL absolue
  // Utiliser le proxy Vite pour les uploads aussi
  return src.startsWith("/") ? src : `/${src}`;
}
/** ==================== **/

const ProfilPage = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [userStats, setUserStats] = useState({
    challengesCompleted: 0,
    currentStreak: 0,
    totalPoints: 0,
    lastLoginDate: new Date(),
    badges: []
  });

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", bio: "", profileImage: ""
  });

  // Charge depuis localStorage (fallback)
  const loadUserFromStorage = useCallback(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return null; }
    if (storedUser && storedUser.email) {
      // normaliser l'avatar au chargement
      storedUser.profileImage = buildImageUrl(storedUser.profileImage);
      return storedUser;
    }
    return null;
  }, [navigate]);

  // Fonction pour charger les statistiques utilisateur
  const loadUserStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Utilise le service pour récupérer les stats
      const stats = await fetchUserStats(token);
      
      // Mappe les badges avec les icônes React
      const badgesWithIcons = stats.badges.map(badge => ({
        ...badge,
        icon: badge.type === 'achievement' ? Trophy :
              badge.type === 'points' ? Star :
              badge.type === 'streak' ? Zap :
              badge.type === 'milestone' ? CheckCircle :
              Trophy // fallback
      }));

      setUserStats({
        ...stats,
        badges: badgesWithIcons
      });
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    // Affichage optimiste immédiat
    const cached = loadUserFromStorage();
    if (cached) {
      setUser(cached);
      setFormData({
        firstName: cached.firstName || "",
        lastName: cached.lastName || "",
        email: cached.email || "",
        phone: cached.phone || "",
        bio: cached.bio || "",
        profileImage: cached.profileImage || ""
      });
      setLoading(false);
    }

    // Source de vérité: API /users/me
    (async () => {
      try {
        const response = await fetch(`${API_BASE}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 401) navigate("/login");
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = await response.json();
        const apiUser = payload?.user || payload || {}; // <-- clé de la correction

        const preservedRole = (cached?.role === "admin") ? "admin" : (apiUser.role || "collaborateur");

        const finalUser = {
          id: apiUser.id || apiUser._id,
          username: apiUser.username,
          firstName: apiUser.firstName || cached?.firstName || "",
          lastName: apiUser.lastName || cached?.lastName || "",
          email: apiUser.email || cached?.email || "",
          phone: apiUser.phone || cached?.phone || "",
          bio: apiUser.bio || cached?.bio || "",
          role: preservedRole,
          createdAt: apiUser.createdAt || cached?.createdAt,
          updatedAt: apiUser.updatedAt || cached?.updatedAt,
          profileImage: buildImageUrl(apiUser.profileImage) || cached?.profileImage || null, // <-- normalisé
        };

        setUser(finalUser);
        setFormData({
          firstName: finalUser.firstName,
          lastName: finalUser.lastName,
          email: finalUser.email,
          phone: finalUser.phone,
          bio: finalUser.bio,
          profileImage: finalUser.profileImage || ""
        });

        // garder le format "brut" renvoyé par l'API en storage
        localStorage.setItem("user", JSON.stringify({ ...apiUser, role: preservedRole }));
        localStorage.setItem("lastTokenUsed", token);
        
        // Charger les statistiques utilisateur
        await loadUserStats();
      } catch (e) {
        console.error("Erreur /users/me:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, loadUserFromStorage, loadUserStats]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté pour modifier votre profil"); return; }

      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        bio: formData.bio
      };

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.msg || "Erreur mise à jour");

      const updated = data.user || data || {};
      const ui = {
        ...user,
        ...updated,
        profileImage: buildImageUrl(updated.profileImage) || user.profileImage
      };

      setUser(ui);
      setFormData({
        firstName: ui.firstName || "",
        lastName: ui.lastName || "",
        email: ui.email || "",
        phone: ui.phone || "",
        bio: ui.bio || "",
        profileImage: ui.profileImage || ""
      });

      // sync localStorage (forme brute renvoyée par l'API)
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, ...updated }));

      setEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert(error.message || "Erreur lors de la sauvegarde du profil");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditing(false);
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Veuillez sélectionner une image valide.");
    if (file.size > 5 * 1024 * 1024) return alert("Max 5MB.");

    setUploadingAvatar(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Vous devez être connecté."); setUploadingAvatar(false); return; }

      const formDataUpload = new FormData();
      formDataUpload.append("profileImage", file);

      const response = await fetch(`${API_BASE}/users/profile-image`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.msg || "Erreur upload");

      // la route renvoie soit { profileImage: "/uploads/..." } soit { user: {...} }
      const raw = data.profileImage || data?.user?.profileImage;
      const imageUrl = buildImageUrl(raw);

      const newUser = { ...user, profileImage: imageUrl };
      const newFormData = { ...formData, profileImage: imageUrl };
      setUser(newUser);
      setFormData(newFormData);

      // stocker la valeur "brute" (relative) en localStorage (comme le back)
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...storedUser, profileImage: raw }));

      alert("Image de profil mise à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert(error.message || "Erreur lors de l'upload de l'image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <HeaderDashboard />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Chargement du profil...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.username ||
    "Utilisateur";

  const avatarUrl = buildImageUrl(user?.profileImage);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
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
                  ) : avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Image de profil"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                  ) : (
                    <User size={48} className="text-white/70" />
                  )}
                </div>

                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera size={24} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
                </label>
              </div>

              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
                <p className="text-white/90 flex items-center justify-center md:justify-start gap-2 mb-3">
                  <Mail size={18} />
                  {user?.email || "Email non renseigné"}
                </p>
                
                {/* Statistiques rapides */}
                <div className="flex items-center justify-center md:justify-start gap-6 text-sm mb-3">
                  <div className="flex items-center gap-1" title="Nombre de défis complétés avec succès">
                    <Target size={16} />
                    <span className="font-medium">{userStats.challengesCompleted}</span>
                    <span className="text-white/80">défis réussis</span>
                  </div>
                  <div className="flex items-center gap-1" title="Nombre de jours consécutifs avec au moins un défi complété">
                    <Zap size={16} />
                    <span className="font-medium">{userStats.currentStreak}</span>
                    <span className="text-white/80">jours de suite</span>
                  </div>
                  <div className="flex items-center gap-1" title="Total des points gagnés en complétant des défis">
                    <Trophy size={16} />
                    <span className="font-medium">{userStats.totalPoints}</span>
                    <span className="text-white/80">points gagnés</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      Membre depuis{" "}
                      {(userStats.joinDate || user?.createdAt)
                        ? new Date(userStats.joinDate || user.createdAt).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
                        : "récemment"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing((v) => !v)}
                  className={`flex items-center gap-2 px-6 py-3 backdrop-blur-sm text-white rounded-xl transition-all border ${
                    editing 
                      ? "bg-red-500/30 border-red-300/50 hover:bg-red-500/40" 
                      : "bg-white/20 border-white/30 hover:bg-white/30"
                  }`}
                >
                  <Edit3 size={18} />
                  {editing ? "Annuler la modification" : "Modifier le profil"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {userStats.badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 group relative"
                  title={badge.description}
                >
                  <badge.icon className={badge.color} size={16} />
                  <span className="text-sm font-medium">{badge.name}</span>
                  
                  {/* Tooltip au survol */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {badge.description}
                  </div>
                </div>
              ))}
              
              {userStats.badges.length === 0 && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-sm font-medium text-white/70">Aucun badge pour le moment</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100">
            {[
              { id: "profile", label: "Profil", icon: User }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "profile" && (
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
                    {displayName || "Non renseigné"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 flex items-center gap-2">
                  <Mail size={16} className="text-gray-500" />
                  {user?.email || "Non renseigné"}
                </div>
              </div>
            </div>

            {/* Téléphone */}
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
                  {formData.phone || "Non renseigné"}
                </div>
              )}
            </div>

            {/* Biographie */}
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
                  {formData.bio || "Non renseigné"}
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

        {/* Section explicative des statistiques */}
        {!editing && (
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Star size={20} />
              Comprendre vos statistiques
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <Target size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Défis réussis</div>
                  <div className="text-gray-600 mt-1">
                    Le nombre total de défis que vous avez complétés avec succès. 
                    Chaque défi terminé augmente ce compteur.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <Zap size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Jours de suite</div>
                  <div className="text-gray-600 mt-1">
                    Votre "streak" : le nombre de jours consécutifs pendant lesquels 
                    vous avez complété au moins un défi.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white rounded-xl">
                <Trophy size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Points gagnés</div>
                  <div className="text-gray-600 mt-1">
                    Le total de tous les points que vous avez accumulés. 
                    Plus vous complétez de défis, plus vous gagnez de points !
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-center">
              <div className="text-sm">
                💡 <strong>Astuce :</strong> Complétez des défis régulièrement pour augmenter vos statistiques et maintenir votre streak !
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilPage;
