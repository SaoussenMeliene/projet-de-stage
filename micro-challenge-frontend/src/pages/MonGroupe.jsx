import React, { useState, useEffect, useRef } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import AddMemberModal from "../components/AddMemberModal";
import { groupService } from "../services/groupService";
import {
  Users,
  Plus,
  Target,
  TrendingUp,
  Award,
  MoreVertical,
  Leaf,
  Code,
  Briefcase,
  UserPlus,
  MessageCircle,
  Loader,
  AlertCircle,
  Send,
  Smile,
  Paperclip,
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Phone,
  Video,
  Search,
  Settings,
  Trophy,
  Heart,
  Download,
  Share,
  ArrowDown
} from "lucide-react";

const MonGroupe = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [userRole, setUserRole] = useState('collaborateur');

  // États pour la messagerie
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showGroupList, setShowGroupList] = useState(true);
  const [activeTab, setActiveTab] = useState('messagerie');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    loadUserGroups();
    loadUserProfile();
    loadMockMessages();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    }
  };

  const loadMockMessages = () => {
    const mockMessages = [
      {
        id: 1,
        author: "Marie Dubois",
        avatar: "MD",
        time: "14:35",
        content: "J'utilise des sacs en tissu réutilisables et je demande directement au vendeur de peser sans les sacs plastiques !",
        isOwn: false
      },
      {
        id: 2,
        author: "Sophie Laurent",
        avatar: "SL",
        time: "14:40",
        content: "Excellente idée ! J'ai aussi commencé à utiliser des contenants en verre pour les produits en vrac. C'est vraiment pratique et écologique.",
        isOwn: false
      },
      {
        id: 3,
        author: "Thomas Martin",
        avatar: "TM",
        time: "14:32",
        content: "Partage-nous ça Marie ! J'ai encore du mal avec les fruits et légumes...",
        isOwn: false
      }
    ];
    setMessages(mockMessages);
  };

  const loadUserGroups = async () => {
    try {
      setLoading(true);
      const data = await groupService.getUserGroups();

      // Transformer les données pour correspondre au format attendu
      const formattedGroups = data.map((group, index) => ({
        id: group._id,
        nom: group.name,
        description: group.challenge?.description || "Groupe de défi",
        avatar: group.name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase(),
        avatarColor: getAvatarColor(index),
        membres: group.stats?.totalMembers || group.members?.length || 0,
        defisActifs: 1, // Un groupe = un défi
        points: group.stats?.totalPoints || 0,
        objectif: group.challenge?.title || "Défi en cours",
        progression: Math.min(100, Math.max(0, (group.stats?.activeParticipants || 0) * 20)),
        couleurTheme: getThemeColor(index),
        icone: getGroupIcon(group.challenge?.category),
        statut: getGroupStatus(group.stats?.activeParticipants || 0),
        dernierDefi: group.challenge?.title || "Aucun défi",
        challengeId: group.challenge?._id,
        members: group.members || []
      }));

      setGroupes(formattedGroups);
    } catch (error) {
      console.error("Erreur lors du chargement des groupes:", error);
      setError("Impossible de charger les groupes");
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500"
    ];
    return colors[index % colors.length];
  };

  const getThemeColor = (index) => {
    const themes = ["blue", "green", "purple", "orange", "cyan"];
    return themes[index % themes.length];
  };

  const getGroupIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'écologique':
      case 'environnement':
        return Leaf;
      case 'technologie':
      case 'tech':
        return Code;
      case 'marketing':
      case 'communication':
        return Briefcase;
      default:
        return Target;
    }
  };

  const getGroupStatus = (activeParticipants) => {
    if (activeParticipants >= 10) return "Très actif";
    if (activeParticipants >= 5) return "Actif";
    return "En cours";
  };

  const handleAddMember = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  const handleMemberAdded = () => {
    loadUserGroups(); // Recharger les groupes après ajout
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupList(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        author: "Vous",
        avatar: "ME",
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        content: newMessage,
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Reset textarea height
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = '56px';
      }

      // Scroll vers le bas
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e) => {
    setNewMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = '56px';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120;
    textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  };



  // Interface de messagerie moderne
  if (!showGroupList && selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-100">
        <HeaderDashboard />

        <div className="flex h-[calc(100vh-80px)]">
          {/* Zone de chat principale */}
          <div className="flex-1 flex flex-col bg-white max-w-4xl mx-auto">

            {/* Onglets de navigation améliorés */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('messagerie')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'messagerie'
                      ? 'bg-yellow-400 text-yellow-900 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle size={18} />
                    <span>Messagerie</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('sondages')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'sondages'
                      ? 'bg-yellow-400 text-yellow-900 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Target size={18} />
                    <span>Sondages</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('galerie')}
                  className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activeTab === 'galerie'
                      ? 'bg-yellow-400 text-yellow-900 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <ImageIcon size={18} />
                    <span>Galerie</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Contenu selon l'onglet actif */}
            {activeTab === 'messagerie' && (
              <>
                {/* Header de la discussion amélioré */}
                <div className="bg-gradient-to-r from-white to-gray-50 px-6 py-6 border-b border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {selectedGroup?.name?.charAt(0) || 'G'}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{selectedGroup?.name || 'Discussion du groupe'}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-600">6 membres en ligne</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">127 messages</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions du header */}
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <Search size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <Phone size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <Video size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
                        <Settings size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Zone de messages avec scroll personnalisé */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {/* Message de Marie Dubois */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      MD
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer">Marie Dubois</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:30</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Heart size={12} className="text-gray-400 hover:text-red-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MessageCircle size={12} className="text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 relative">
                        <p className="text-gray-800 leading-relaxed">Salut tout le monde ! J'ai trouvé une super astuce pour réduire les emballages au supermarché 🌱</p>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors text-xs">
                            <span>👍</span>
                            <span className="text-blue-600 font-medium">3</span>
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded-full transition-colors text-xs">
                            <span>🌱</span>
                            <span className="text-green-600 font-medium">2</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message de Thomas Martin */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      TM
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-green-600 cursor-pointer">Thomas Martin</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:32</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Heart size={12} className="text-gray-400 hover:text-red-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MessageCircle size={12} className="text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <p className="text-gray-800 leading-relaxed">Partage-nous ça Marie ! J'ai encore du mal avec les fruits et légumes...</p>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 rounded-full transition-colors text-xs">
                            <span>🤔</span>
                            <span className="text-yellow-600 font-medium">1</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message de Marie Dubois avec image */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      MD
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer">Marie Dubois</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:35</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Heart size={12} className="text-gray-400 hover:text-red-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MessageCircle size={12} className="text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <p className="text-gray-800 leading-relaxed mb-4">J'utilise des sacs en tissu réutilisables et je demande directement au vendeur de peser sans les sacs plastiques !</p>

                        {/* Image améliorée */}
                        <div className="relative group/image">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-blue-200 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer transform hover:scale-105">
                            <div className="relative">
                              <ImageIcon className="w-12 h-12 text-blue-400 mx-auto mb-3 group-hover/image:scale-110 transition-transform" />
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">✓</span>
                              </div>
                            </div>
                            <span className="text-sm text-blue-600 font-semibold">Sacs réutilisables.jpg</span>
                            <p className="text-xs text-blue-500 mt-1">Cliquez pour agrandir</p>
                          </div>

                          {/* Overlay d'actions sur l'image */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover/image:opacity-100 transition-opacity flex gap-1">
                            <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                              <Download size={12} className="text-gray-600" />
                            </button>
                            <button className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50">
                              <Share size={12} className="text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded-full transition-colors text-xs">
                            <span>💚</span>
                            <span className="text-green-600 font-medium">5</span>
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors text-xs">
                            <span>🌱</span>
                            <span className="text-blue-600 font-medium">4</span>
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 rounded-full transition-colors text-xs">
                            <span>💡</span>
                            <span className="text-yellow-600 font-medium">2</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message de Sophie Laurent */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                      SL
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-purple-600 cursor-pointer">Sophie Laurent</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:40</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Nouveau membre</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <Heart size={12} className="text-gray-400 hover:text-red-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                            <MessageCircle size={12} className="text-gray-400 hover:text-blue-500" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <p className="text-gray-800 leading-relaxed">Excellente idée ! J'ai aussi commencé à utiliser des contenants en verre pour les produits en vrac. C'est vraiment pratique et écologique.</p>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors text-xs">
                            <span>👏</span>
                            <span className="text-purple-600 font-medium">2</span>
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded-full transition-colors text-xs">
                            <span>♻️</span>
                            <span className="text-green-600 font-medium">3</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages dynamiques de l'utilisateur */}
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 group ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 ${message.isOwn ? 'bg-yellow-500' : 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}>
                        {message.isOwn ? 'ME' : message.avatar}
                      </div>
                      <div className={`flex-1 max-w-2xl ${message.isOwn ? 'flex flex-col items-end' : ''}`}>
                        <div className={`flex items-center gap-3 mb-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-sm font-bold ${message.isOwn ? 'text-yellow-700' : 'text-gray-900'} cursor-pointer`}>
                            {message.author}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{message.time}</span>
                          {message.isOwn && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">Vous</span>}
                        </div>
                        <div className={`${message.isOwn ? 'bg-yellow-400 text-yellow-900' : 'bg-white'} p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 ${message.isOwn ? 'max-w-lg' : ''}`}>
                          <p className={`${message.isOwn ? 'text-yellow-900' : 'text-gray-800'} leading-relaxed`}>
                            {message.content}
                          </p>

                          {/* Réactions pour les nouveaux messages */}
                          {!message.isOwn && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <Plus size={12} className="text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />

                  {/* Notification de nouveau message */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 opacity-0 pointer-events-none transition-all duration-300 hover:opacity-100">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Nouveau message de Thomas</span>
                    <button className="ml-2 hover:bg-blue-600 rounded-full p-1">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>

                {/* Zone de saisie améliorée */}
                <div className="bg-white border-t border-gray-200 p-6">
                  <div className="flex items-end gap-4">
                    {/* Boutons d'actions à gauche */}
                    <div className="flex items-center gap-2">
                      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                        <Paperclip size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                      <button className="p-3 hover:bg-gray-100 rounded-full transition-colors group">
                        <Camera size={20} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                    </div>

                    {/* Zone de saisie principale */}
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Tapez votre message..."
                        className="w-full p-4 pr-16 bg-yellow-400 text-yellow-900 placeholder-yellow-700 rounded-3xl border-none focus:outline-none focus:ring-3 focus:ring-yellow-300 resize-none font-medium shadow-lg"
                        rows="1"
                        style={{
                          minHeight: '56px',
                          maxHeight: '120px',
                          lineHeight: '1.5'
                        }}
                      />

                      {/* Boutons dans la zone de saisie */}
                      <div className="absolute right-3 bottom-3 flex items-center gap-2">
                        <button className="p-2 hover:bg-yellow-500 rounded-full transition-colors group">
                          <Smile size={18} className="text-yellow-800 group-hover:text-yellow-900" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className={`p-2 rounded-full transition-all duration-200 ${
                            newMessage.trim()
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                              : 'bg-yellow-300 text-yellow-600 cursor-not-allowed'
                          }`}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de frappe amélioré */}
                  <div className="mt-3 text-xs text-gray-500 min-h-[20px] flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-blue-600 font-medium">Thomas Martin</span>
                      <span>est en train d'écrire...</span>
                    </div>
                  </div>

                  {/* Suggestions rapides */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                      👍 Super idée !
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                      🌱 Écologique
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                      💡 J'ai une idée
                    </button>
                    <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors">
                      ❓ Question
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Contenu Sondages */}
            {activeTab === 'sondages' && (
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target size={32} className="text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun sondage actif</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Créez votre premier sondage pour recueillir l'avis des membres du groupe sur vos prochains défis !
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Créer un sondage
                  </button>
                </div>
              </div>
            )}

            {/* Contenu Galerie */}
            {activeTab === 'galerie' && (
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ImageIcon size={32} className="text-pink-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucune photo partagée</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Partagez vos moments forts, vos réussites et vos découvertes avec les membres de votre groupe !
                  </p>
                  <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Ajouter une photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar droite - Membres et actions */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 hidden lg:block shadow-lg">
            {/* Membres du groupe */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Membres du groupe</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">6</span>
              </div>

              <div className="space-y-4">
                {/* Marie Dubois */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        MD
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Marie Dubois</span>
                      <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">150pts</span>
                  </div>
                </div>

                {/* Thomas Martin */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        TM
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Thomas Martin</span>
                      <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">121pts</span>
                  </div>
                </div>

                {/* Sophie Laurent */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        SL
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Sophie Laurent</span>
                      <div className="text-xs text-gray-500">Hors ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">108pts</span>
                  </div>
                </div>

                {/* Pierre Durand */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        PD
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Pierre Durand</span>
                      <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">90pts</span>
                  </div>
                </div>

                {/* Emma Rousseau */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        ER
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Emma Rousseau</span>
                      <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">200pts</span>
                  </div>
                </div>

                {/* Vous */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        Me
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-blue-800">Vous</span>
                      <div className="text-xs text-blue-600">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-800">75pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 font-semibold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group">
                  <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                  Proposer un sondage
                </button>
                <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group">
                  <Camera size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  Partager une photo
                </button>
                <button className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group">
                  <Heart size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  Encourager un membre
                </button>
              </div>
            </div>

            {/* Statistiques du groupe */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Statistiques du groupe</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Messages envoyés</span>
                    <span className="text-lg font-bold text-gray-900">127</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '85%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Objectif: 150 messages</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Participation active</span>
                    <span className="text-lg font-bold text-green-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Excellent niveau d'engagement</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Objectifs atteints</span>
                    <span className="text-lg font-bold text-purple-600">6/8</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '75%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2 objectifs restants</div>
                </div>

                {/* Badge de performance */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-green-800">Groupe performant</div>
                      <div className="text-xs text-green-600">Top 10% des groupes actifs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }




  // Interface principale - Liste des groupes
  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      <HeaderDashboard />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Groupes</h1>
                <p className="text-gray-600 text-lg">Collaborez avec vos collègues pour relever des défis ensemble</p>
              </div>

              {userRole === 'admin' && (
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  <Plus size={20} />
                  <span>Créer un groupe</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader className="w-6 h-6 animate-spin text-purple-500" />
              <span className="text-gray-600">Chargement des groupes...</span>
            </div>
          </div>
        )}

        {/* État d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de chargement</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadUserGroups}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Grille des groupes */}
        {!loading && !error && (
          <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {groupes.length === 0 ? (
              <div className="col-span-full">
                <div className="text-center py-8 mb-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun groupe trouvé</h3>
                  <p className="text-gray-500 mb-6">Rejoignez un défi pour être automatiquement ajouté à un groupe !</p>
                </div>

                {/* Interface de groupes disponibles */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Équipe Marketing */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        EM
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Équipe Marketing</h3>
                        <p className="text-sm text-gray-600">Défis écologiques pour l'équipe marketing</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">12</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Membres</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">3</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Défis actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">2450</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGroupSelect(groupes[0])}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Rejoindre la discussion
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Développeurs Verts */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        DV
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Développeurs Verts</h3>
                        <p className="text-sm text-gray-600">Communauté tech engagée pour l'environnement</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">24</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Membres</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">5</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Défis actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">4120</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGroupSelect(groupes[1])}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Rejoindre la discussion
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Bureau Zéro Déchet */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        BZ
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">Bureau Zéro Déchet</h3>
                        <p className="text-sm text-gray-600">Objectif zéro déchet au bureau</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">8</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Membres</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">2</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Défis actifs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">1890</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleGroupSelect(groupes[2])}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Rejoindre la discussion
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={16} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-gray-500 mb-4">Rejoignez un groupe pour commencer à collaborer !</p>
                  <button
                    onClick={() => window.location.href = '/mes-defis'}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                  >
                    Découvrir tous les défis
                  </button>
                </div>
              </div>
            ) : (
              groupes.map((groupe, index) => (
                <div
              key={groupe.id}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
              onClick={() => handleGroupSelect(groupe)}
            >
              {/* Header de la carte */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${groupe.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {groupe.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{groupe.nom}</h3>
                      <p className="text-gray-600 text-sm">{groupe.description}</p>
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                    <MoreVertical size={20} className="text-gray-400" />
                  </button>
                </div>

                {/* Statut et objectif */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      groupe.statut === 'Très actif'
                        ? 'bg-green-100 text-green-700'
                        : groupe.statut === 'Actif'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {groupe.statut}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{groupe.objectif}</p>
                </div>
              </div>

              {/* Statistiques */}
              <div className="px-6 pb-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{groupe.membres}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Membres</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{groupe.defisActifs}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Défis actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">{groupe.points}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-bold text-gray-800">{groupe.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${groupe.avatarColor} transition-all duration-1000`}
                      style={{ width: `${groupe.progression}%` }}
                    ></div>
                  </div>
                </div>

                {/* Dernier défi */}
                <div className="mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Dernier défi</span>
                    </div>
                    <p className="text-sm text-gray-600">{groupe.dernierDefi}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupSelect(groupe);
                    }}
                    className={`flex-1 bg-gradient-to-r ${groupe.avatarColor} text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg`}
                  >
                    <MessageCircle size={16} />
                    <span>Rejoindre la discussion</span>
                  </button>

                  {userRole === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddMember(groupe.id);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
                      title="Ajouter des membres"
                    >
                      <UserPlus size={16} />
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupSelect(groupe);
                    }}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
                    title="Ouvrir le chat"
                  >
                    <MessageCircle size={16} />
                  </button>
                </div>
              </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Section Statistiques globales */}
        <div className={`mt-12 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Statistiques globales</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="text-white w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">44</div>
                <div className="text-gray-600 text-sm">Total membres</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Target className="text-white w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">10</div>
                <div className="text-gray-600 text-sm">Défis actifs</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Award className="text-white w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">8460</div>
                <div className="text-gray-600 text-sm">Points totaux</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="text-white w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">73%</div>
                <div className="text-gray-600 text-sm">Progression moy.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal d'ajout de membres */}
        <AddMemberModal
          isOpen={showAddMemberModal}
          onClose={() => setShowAddMemberModal(false)}
          groupId={selectedGroupId}
          onMemberAdded={handleMemberAdded}
        />
      </div>
    </div>
  );
};

export default MonGroupe;