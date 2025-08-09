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
  Shield
} from "lucide-react";
import Logo from "./Logo";
import UserAvatar from "./UserAvatar";

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

  // Notifications (à remplacer par des données réelles)
  const notifications = [
    {
      id: 1,
      type: "success",
      icon: Award,
      title: "Badge débloqué !",
      message: "Vous avez obtenu le badge 'Écolo Expert'",
      time: "Il y a 2 min",
      read: false,
      color: "text-yellow-500 bg-yellow-50"
    },
    {
      id: 2,
      type: "info",
      icon: MessageCircle,
      title: "Nouveau commentaire",
      message: "Jean a commenté votre défi 'Zéro déchet'",
      time: "Il y a 15 min",
      read: false,
      color: "text-blue-500 bg-blue-50"
    },
    {
      id: 3,
      type: "reminder",
      icon: Clock,
      title: "Rappel de défi",
      message: "N'oubliez pas de compléter votre défi quotidien",
      time: "Il y a 1h",
      read: true,
      color: "text-purple-500 bg-purple-50"
    },
    {
      id: 4,
      type: "like",
      icon: Heart,
      title: "Votre défi a été aimé",
      message: "5 personnes ont aimé votre défi créatif",
      time: "Il y a 2h",
      read: true,
      color: "text-pink-500 bg-pink-50"
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

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
              const serverUser = data.user;
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
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.color}`}>
                          <notification.icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-800 text-sm truncate">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed mb-1">
                            {notification.message}
                          </p>
                          <span className="text-gray-400 text-xs">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100">
                  <button className="w-full text-center text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors duration-200">
                    Voir toutes les notifications
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
    { icon: Trophy, label: "Récompenses", path: "/recompenses", color: "yellow" },
    ...(userRole === 'admin' ? [{ icon: Shield, label: "Admin", path: "/admin", color: "red" }] : [])
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

