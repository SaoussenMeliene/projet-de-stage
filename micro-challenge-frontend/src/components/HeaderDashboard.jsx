import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Target,
  Calendar,
  Users,
  Trophy,
  Search,
  Bell,
  Plus,
  User,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Check,
  Clock,
  Award,
  MessageCircle,
  Heart,
  Shield,
  FileText,
  Moon,
  Sun
} from "lucide-react";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import { useNotifications } from "../hooks/useNotifications";
import { useTheme } from "../contexts/ThemeContext";


const HeaderDashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState('collaborateur');
  const [user, setUser] = useState({
    name: "Chargement...",
    email: "chargement@satoripop.com",
    role: "Membre actif"
  });
  const location = useLocation();

  // Utiliser le hook de notifications
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications 
  } = useNotifications();

  // Fonction pour obtenir l'icône selon le type de notification
  const getNotificationIcon = (notification) => {
    if (notification.title.includes('approuvée')) return Award;
    if (notification.title.includes('rejetée')) return X;
    if (notification.title.includes('Nouveau défi')) return Plus;
    return Bell;
  };

  // Fonction pour obtenir la couleur selon le type de notification
  const getNotificationColor = (notification) => {
    if (notification.title.includes('approuvée')) return "text-green-500 bg-green-50";
    if (notification.title.includes('rejetée')) return "text-red-500 bg-red-50";
    if (notification.title.includes('Nouveau défi')) return "text-blue-500 bg-blue-50";
    return "text-gray-500 bg-gray-50";
  };

  // Fonction pour formater le temps
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jour(s)`;
  };

  // Gérer le clic sur une notification
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  // 🔹 Détecte le scroll pour réduire le logo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (!event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
      if (!event.target.closest('.user-menu-dropdown')) {
        setShowUserMenu(false);
      }
    };

    // Récupérer les données utilisateur complètes
    const loadUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          // D'abord, utiliser les données stockées localement
          const userData = JSON.parse(storedUser);
          const displayName = userData.firstName && userData.lastName
            ? `${userData.firstName} ${userData.lastName}`
            : userData.username || (userData.email ? userData.email.split('@')[0] : 'Utilisateur');

          setUser({
            name: displayName,
            email: userData.email,
            profileImage: userData.profileImage ?
              (userData.profileImage.startsWith('http') ? userData.profileImage : `http://localhost:5000${userData.profileImage}`) :
              null,
            role: userData.role === 'admin' ? 'Administrateur' : 'Collaborateur'
          });
          setUserRole(userData.role);

          // Ensuite, essayer de récupérer les données à jour du serveur
          try {
            const response = await fetch("http://localhost:5000/api/users/me", {
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            });

            if (response.ok) {
              const data = await response.json();
              const serverUser = data.user || data; // Gérer les différents formats de réponse

              // Vérifier que serverUser existe et n'est pas null
              if (serverUser && typeof serverUser === 'object') {
                const serverDisplayName = serverUser.firstName && serverUser.lastName
                  ? `${serverUser.firstName} ${serverUser.lastName}`
                  : serverUser.username || (serverUser.email ? serverUser.email.split('@')[0] : 'Utilisateur');

                setUser({
                  name: serverDisplayName,
                  email: serverUser.email,
                  profileImage: serverUser.profileImage ?
                    (serverUser.profileImage.startsWith('http') ? serverUser.profileImage : `http://localhost:5000${serverUser.profileImage}`) :
                    null,
                  role: serverUser.role === 'admin' ? 'Administrateur' : 'Collaborateur'
                });
                setUserRole(serverUser.role);
              } else {
                console.log('Données serveur invalides:', serverUser);
              }
            } else {
              console.log('Erreur API:', response.status, response.statusText);
            }
          } catch (error) {
            console.log('Erreur réseau lors de la récupération du profil:', error);
            // On garde les données du localStorage en cas d'erreur
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      }
    };

    loadUserData();
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Écouter les changements de localStorage pour mettre à jour le rôle
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.role && storedUser.role !== userRole) {
        setUserRole(storedUser.role);
      }
    };

    // Écouter les événements de changement de localStorage
    window.addEventListener('storage', handleStorageChange);

    // Vérifier immédiatement au montage
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userRole]);

  const handleLogout = () => {
    // Nettoyer le stockage local
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastTokenUsed");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    console.log("Déconnexion effectuée");

    // Redirection vers la page de connexion
    window.location.href = "/login";
  };

  return (
    <header className={`w-full shadow-sm px-8 py-6 sticky top-0 z-50 transition-all duration-300 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Ligne 1 : Logo + Recherche + Icônes */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto mb-6 relative">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 transition-all duration-300">
          <Logo
            size={isScrolled ? "small" : "medium"}
            className="transition-all duration-300"
          />
          <span
            className={`font-bold transition-all duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-600'
            } ${isScrolled ? "text-lg" : "text-xl"}`}
          >
            Challenges
          </span>
        </div>

        {/* Barre de recherche compacte */}
        <div className="flex-1 flex justify-center px-4">
          <div
            className={`flex items-center rounded-full px-4 py-2 transition-all duration-300 group
                        ${isScrolled ? "w-[16rem]" : "w-[24rem]"}
                        ${isDark 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                        }`}
          >
            <Search className={`mr-2 transition-colors duration-200 ${
              isDark 
                ? 'text-gray-400 group-hover:text-gray-200' 
                : 'text-gray-500 group-hover:text-gray-700'
            }`} size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className={`bg-transparent outline-none w-full text-sm ${
                isDark 
                  ? 'placeholder-gray-400 text-gray-200' 
                  : 'placeholder-gray-500 text-gray-700'
              }`}
            />
          </div>
        </div>

        {/* Icônes à droite */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Bouton basculer thème */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? (
              <Sun className="text-yellow-400" size={20} />
            ) : (
              <Moon className="text-gray-700" size={20} />
            )}
          </button>

          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-105 ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Bell className={isDark ? 'text-gray-300' : 'text-gray-700'} size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown des notifications */}
            {showNotifications && (
              <div className={`absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-2xl z-50 max-h-96 overflow-hidden ${
                isDark 
                  ? 'bg-gray-800 border border-gray-600' 
                  : 'bg-white border border-gray-100'
              }`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b ${
                  isDark ? 'border-gray-600' : 'border-gray-100'
                }`}>
                  <h3 className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                    Notifications
                  </h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className={`p-1 rounded-full transition-colors duration-200 ${
                      isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  </button>
                </div>

                {/* Liste des notifications */}
                <div className="max-h-80 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="mt-2 text-sm">Chargement...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const NotificationIcon = getNotificationIcon(notification);
                      const colorClass = getNotificationColor(notification);
                      
                      return (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                            !notification.isRead ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
                              <NotificationIcon size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-800 text-sm truncate">
                                  {notification.title}
                                </h4>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs leading-relaxed mb-1">
                                {notification.message}
                              </p>
                              <span className="text-gray-400 text-xs">
                                {formatTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 space-y-2">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="w-full text-center text-green-600 text-sm font-medium hover:text-green-700 transition-colors duration-200"
                    >
                      Marquer tout comme lu ({unreadCount})
                    </button>
                  )}
                  <button 
                    onClick={refreshNotifications}
                    className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200"
                  >
                    Actualiser
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu utilisateur */}
          <div className="relative user-menu-dropdown">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-2 p-1 rounded-full transition-all duration-200 hover:scale-105 ${
                isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <UserAvatar
                name={user.name}
                email={user.email}
                profileImage={user.profileImage}
                size="md"
                showBorder={true}
              />
              <ChevronDown size={16} className={`transition-transform duration-200 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              } ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown du menu utilisateur */}
            {showUserMenu && (
              <div className={`absolute right-0 top-full mt-2 w-72 rounded-2xl shadow-2xl z-50 overflow-hidden ${
                isDark ? 'bg-gray-800 border border-gray-600' : 'bg-white border border-gray-100'
              }`}>
                {/* Profil utilisateur */}
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={user.name}
                      email={user.email}
                      profileImage={user.profileImage}
                      size="lg"
                      showBorder={true}
                      className="border-white/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-blue-100 text-sm">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <Link
                    to="/profil"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <User size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    <span className="font-medium">Mon profil</span>
                  </Link>

                  <Link
                    to="/parametres"
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 ${
                      isDark 
                        ? 'hover:bg-gray-700 text-gray-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Settings size={18} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                    <span className="font-medium">Paramètres</span>
                  </Link>

                  {(() => {
                    // Vérifier directement dans localStorage pour éviter les problèmes de timing
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const isAdminFromStorage = storedUser.role === 'admin';
                    const isAdminFromState = userRole === 'admin';

                    return isAdminFromStorage || isAdminFromState;
                  })() && (
                    <Link
                      to="/admin-dashboard"
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 text-red-600 ${
                        isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                      }`}
                    >
                      <Shield size={18} className="text-red-500" />
                      <span className="font-medium">Administration</span>
                    </Link>
                  )}

                  <div className={`border-t my-2 ${isDark ? 'border-gray-600' : 'border-gray-100'}`}></div>

                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 text-red-600 w-full text-left ${
                      isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                    }`}
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Se déconnecter</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ligne 2 : Navigation */}
     <nav className={`flex justify-start gap-8 mt-8 max-w-7xl mx-auto ${
       isDark ? 'text-gray-300' : 'text-gray-600'
     }`}>
  {[
    { icon: Home, label: "Accueil", path: "/accueil", color: "blue" },
    { icon: Target, label: "Mes Défis", path: "/mes-defis", color: "green" },
    { icon: Calendar, label: "Calendrier", path: "/calendrier", color: "purple" },
    { icon: Users, label: "Mon Groupe", path: "/mon-groupe", color: "orange" },
    { icon: Trophy, label: "Récompenses", path: "/recompenses", color: "yellow" }
  ].map((item, index) => {
    const isActive = location.pathname === item.path;
    const colorClasses = isDark ? {
      blue: isActive ? "text-blue-400 bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20",
      green: isActive ? "text-green-400 bg-green-900/30" : "hover:text-green-400 hover:bg-green-900/20",
      purple: isActive ? "text-purple-400 bg-purple-900/30" : "hover:text-purple-400 hover:bg-purple-900/20",
      orange: isActive ? "text-orange-400 bg-orange-900/30" : "hover:text-orange-400 hover:bg-orange-900/20",
      yellow: isActive ? "text-yellow-400 bg-yellow-900/30" : "hover:text-yellow-400 hover:bg-yellow-900/20",
      red: isActive ? "text-red-400 bg-red-900/30" : "hover:text-red-400 hover:bg-red-900/20",
    } : {
      blue: isActive ? "text-blue-600 bg-blue-50" : "hover:text-blue-600 hover:bg-blue-50",
      green: isActive ? "text-green-600 bg-green-50" : "hover:text-green-600 hover:bg-green-50",
      purple: isActive ? "text-purple-600 bg-purple-50" : "hover:text-purple-600 hover:bg-purple-50",
      orange: isActive ? "text-orange-600 bg-orange-50" : "hover:text-orange-600 hover:bg-orange-50",
      yellow: isActive ? "text-yellow-600 bg-yellow-50" : "hover:text-yellow-600 hover:bg-yellow-50",
      red: isActive ? "text-red-600 bg-red-50" : "hover:text-red-600 hover:bg-red-50",
    };

    return (
      <Link
        key={index}
        to={item.path}
        className={`flex flex-row items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 group relative ${colorClasses[item.color]} ${
          isActive ? "font-semibold shadow-sm" : "font-medium"
        }`}
      >
        <item.icon
          className={`transition-all duration-300 ${
            isActive ? "scale-110" : "group-hover:scale-110"
          }`}
          size={20}
        />
        <span className="text-sm">{item.label}</span>
        {isActive && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-current rounded-full"></div>
        )}
      </Link>
    );
  })}
</nav>
    </header>
  );
};

export default HeaderDashboard;

