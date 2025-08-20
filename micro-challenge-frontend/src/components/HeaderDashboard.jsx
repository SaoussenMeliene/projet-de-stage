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
  FileText
} from "lucide-react";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";
import { useNotifications } from "../hooks/useNotifications";

const HeaderDashboard = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userRole, setUserRole] = useState('collaborateur');
  const [user, setUser] = useState({
    name: "Chargement...",
    email: "chargement@satoripop.com",
    role: "Membre actif",
    points: 1250,
    level: "Expert"
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
            role: userData.role === 'admin' ? 'Administrateur' : 'Collaborateur',
            points: 1250, // Valeur par défaut
            level: userData.role === 'admin' ? 'Admin' : 'Expert'
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
                  role: serverUser.role === 'admin' ? 'Administrateur' : 'Collaborateur',
                  points: 1250,
                  level: serverUser.role === 'admin' ? 'Admin' : 'Expert'
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
    <header className="w-full shadow-sm bg-white px-8 py-6 sticky top-0 z-50 transition-all duration-300">
      {/* Ligne 1 : Logo + Recherche + Icônes */}
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto mb-6 relative">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0 transition-all duration-300">
          <Logo
            size={isScrolled ? "small" : "medium"}
            className="transition-all duration-300"
          />
          <span
            className={`font-bold text-gray-600 transition-all duration-300 ${
              isScrolled ? "text-lg" : "text-xl"
            }`}
          >
            Challenges
          </span>
        </div>

        {/* Barre de recherche compacte */}
        <div className="flex-1 flex justify-center px-4">
          <div
            className={`flex items-center bg-gray-100 rounded-full px-4 py-2 transition-all duration-300 hover:bg-gray-200 group
                        ${isScrolled ? "w-[16rem]" : "w-[24rem]"}`}
          >
            <Search className="text-gray-500 mr-2 group-hover:text-gray-700 transition-colors duration-200" size={16} />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent outline-none w-full placeholder-gray-500 text-gray-700 text-sm"
            />
          </div>
        </div>

        {/* Icônes à droite */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Notifications */}
          <div className="relative notification-dropdown">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <Bell className="text-gray-700" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown des notifications */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X size={16} className="text-gray-500" />
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
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <UserAvatar
                name={user.name}
                email={user.email}
                profileImage={user.profileImage}
                size="md"
                showBorder={true}
              />
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown du menu utilisateur */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
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
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {user.level}
                        </span>
                        <span className="text-xs">
                          {user.points} points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <Link
                    to="/profil"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                  >
                    <User size={18} className="text-gray-500" />
                    <span className="font-medium">Mon profil</span>
                  </Link>

                  <Link
                    to="/parametres"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-gray-700"
                  >
                    <Settings size={18} className="text-gray-500" />
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
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 text-red-700"
                    >
                      <Shield size={18} className="text-red-500" />
                      <span className="font-medium">Administration</span>
                    </Link>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors duration-200 text-red-600 w-full text-left"
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
     <nav className="flex justify-start gap-8 text-gray-600 mt-8 max-w-7xl mx-auto">
  {[
    { icon: Home, label: "Accueil", path: "/accueil", color: "blue" },
    { icon: Target, label: "Mes Défis", path: "/mes-defis", color: "green" },
    { icon: Calendar, label: "Calendrier", path: "/calendrier", color: "purple" },
    { icon: Users, label: "Mon Groupe", path: "/mon-groupe", color: "orange" },
    { icon: Trophy, label: "Récompenses", path: "/recompenses", color: "yellow" }
  ].map((item, index) => {
    const isActive = location.pathname === item.path;
    const colorClasses = {
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

