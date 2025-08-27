import React, { useState, useEffect, useRef } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import PollComponent from "../components/PollComponent";
import { groupService } from "../services/groupService";
import { useTheme } from "../contexts/ThemeContext";
import {
  Users,
  Plus,
  Target,
  MessageCircle,
  Send,
  Smile,
  Paperclip,
  Camera,
  Image as ImageIcon,
  Trophy,
  Heart,
  Loader,
  AlertCircle,
  Leaf,
  Award
} from "lucide-react";

const MonGroupeSimple = () => {
  const [activeTab, setActiveTab] = useState('messagerie');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [showGroupList, setShowGroupList] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupes, setGroupes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // { [groupId]: Set<userId> }
  const messagesEndRef = useRef(null);
  const lastGroupIdRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  // Image en attente de confirmation
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingImageUrl, setPendingImageUrl] = useState('');
  const { isDark } = useTheme();
  
  // Actions rapides
  const [showQuickPoll, setShowQuickPoll] = useState(false);
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Decode userId from JWT (unverified, for UI only)
  useEffect(() => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) return;
      const parts = token.split('.');
      if (parts.length !== 3) return;
      const payload = JSON.parse(atob(parts[1]));
      if (payload?.userId) setCurrentUserId(String(payload.userId));
    } catch {}
  }, []);

  // Fonction pour obtenir la couleur selon la catégorie
  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('écolog') || cat.includes('ecolog')) return "from-green-400 to-emerald-500";
    if (cat.includes('sport')) return "from-blue-400 to-indigo-500";
    if (cat.includes('créat') || cat.includes('creat')) return "from-purple-400 to-pink-500";
    if (cat.includes('solid')) return "from-orange-400 to-red-500";
    if (cat.includes('éduc') || cat.includes('educ')) return "from-yellow-400 to-amber-500";
    return "from-gray-400 to-slate-500";
  };

  // Fonction pour obtenir l'icône selon la catégorie
  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('écolog') || cat.includes('ecolog')) return Leaf;
    if (cat.includes('sport')) return Trophy;
    if (cat.includes('créat') || cat.includes('creat')) return Target;
    if (cat.includes('solid')) return Heart;
    if (cat.includes('éduc') || cat.includes('educ')) return Award;
    return Users;
  };

  // Charger les groupes de l'utilisateur
  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Chargement des groupes de l\'utilisateur...');
        
        const response = await groupService.getUserGroups();
        console.log('✅ Groupes chargés:', response);
        
        // Transformer les données pour l'interface
        const transformedGroups = response.map(group => ({
          id: group._id,
          name: group.name,
          description: group.description || `Groupe de discussion pour le défi "${group.challenge?.title || 'Défi'}"`,
          members: group.stats?.totalMembers || group.members?.length || 0,
          avatarColor: getCategoryColor(group.challenge?.category),
          category: group.challenge?.category || 'Autre',
          challengeTitle: group.challenge?.title || 'Défi',
          totalPoints: group.stats?.totalPoints || 0,
          activeParticipants: group.stats?.activeParticipants || 0,
          rawData: group // Garder les données originales
        }));
        
        setGroupes(transformedGroups);
        console.log(`📊 ${transformedGroups.length} groupes transformés`);
        
      } catch (err) {
        console.error('❌ Erreur lors du chargement des groupes:', err);
        setError(err.message || 'Erreur lors du chargement des groupes');
      } finally {
        setLoading(false);
      }
    };

    loadUserGroups();
  }, []);

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);
    setShowGroupList(false);
    try {
      // rejoindre la room du groupe côté socket
      try {
        const { connectSocket } = await import('../lib/socket');
        const s = connectSocket();
        // quitter l'ancienne room si besoin
        if (lastGroupIdRef.current && lastGroupIdRef.current !== group.id) {
          s.emit('group:leave', { groupId: lastGroupIdRef.current });
        }
        lastGroupIdRef.current = group.id;
        s.emit('group:join', { groupId: group.id });
      } catch {}
      // Charger messages
      const { messageService } = await import('../services/messageService');
      const msgs = await messageService.getGroupMessages(group.id);

      // Charger membres dynamiques + participants (scores)
      const { groupService } = await import('../services/groupService');
      const details = await groupService.getGroupDetails(group.id);

      // Construire une map des scores par userId à partir des participants
      const scoreMap = new Map();
      (details.participants || []).forEach((p) => {
        if (p.user?._id) scoreMap.set(String(p.user._id), p.score || 0);
      });

      // Déduire en ligne/hors-ligne selon l'activité message récente (5 min)
      const now = Date.now();
      const recentMap = new Map();
      (msgs || []).forEach((m) => {
        if (m.sender?._id && m.createdAt) {
          const last = recentMap.get(String(m.sender._id)) || 0;
          const ts = new Date(m.createdAt).getTime();
          if (ts > last) recentMap.set(String(m.sender._id), ts);
        }
      });

      // Enrichir la liste des membres
      const members = Array.isArray(details.members) ? details.members.map((u) => ({
        ...u,
        _id: u._id,
        username: u.username,
        email: u.email,
        score: scoreMap.get(String(u._id)) || 0,
        online: (now - (recentMap.get(String(u._id)) || 0)) <= 5 * 60 * 1000,
      })) : [];

      setMessages(msgs || []);
      setSelectedGroup((prev) => ({
        ...prev,
        rawData: details,
        membersList: members,
        stats: details.stats || prev?.stats || {},
      }));
    } catch (e) {
      console.error('Erreur chargement groupe/messages:', e);
      setMessages([]);
    }
  };

  const handleSendMessage = async (payload = null) => {
    const content = payload?.content ?? newMessage.trim();
    const file = payload?.file || null;
    if (!content && !file) return;
    try {
      setSending(true);
      const { messageService, uploadService } = await import('../services/messageService');
      let mediaUrl = '';
      let mediaType = '';
      if (file) {
        const up = await uploadService.uploadImage(file);
        mediaUrl = up.url || up.data?.url || '';
        mediaType = 'image';
      }
      const sent = await messageService.sendMessage(selectedGroup.id, { content, mediaUrl, mediaType });
      const saved = sent.data || sent;
      // Ajout unique: évite les doublons si le socket renvoie le même message
      setMessages((prev) => {
        const id = saved && saved._id ? String(saved._id) : null;
        const signature = id || `${saved?.sender?._id || ''}|${saved?.content || ''}|${saved?.createdAt || ''}`;
        const exists = prev.some((m) => {
          const mid = m && m._id ? String(m._id) : null;
          const sig = mid || `${m?.sender?._id || ''}|${m?.content || ''}|${m?.createdAt || ''}`;
          return sig === signature;
        });
        if (exists) return prev;
        return [...prev, saved];
      });
      setNewMessage('');
    } catch (e) {
      console.error('Erreur envoi message:', e);
      alert("Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  };

  const fileInputRef = useRef(null);
  const textAreaRef = useRef(null);

  const openImagePicker = () => fileInputRef.current && fileInputRef.current.click();
  const onImageSelected = async (e) => {
    const f = e.target.files?.[0];
    if (f) {
      // Met en attente et affiche un aperçu avec validation
      setPendingImage(f);
      const url = URL.createObjectURL(f);
      setPendingImageUrl(url);
      // Ne pas envoyer tout de suite
      e.target.value = '';
    }
  };

  const confirmSendPendingImage = async () => {
    if (!pendingImage) return;
    await handleSendMessage({ content: newMessage.trim(), file: pendingImage });
    // Nettoyage
    try { if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl); } catch {}
    setPendingImage(null);
    setPendingImageUrl('');
  };

  const cancelPendingImage = () => {
    // Annuler l'envoi de l'image
    try { if (pendingImageUrl) URL.revokeObjectURL(pendingImageUrl); } catch {}
    setPendingImage(null);
    setPendingImageUrl('');
  };

  // Actions rapides
  const handleQuickPoll = () => {
    setActiveTab('sondages');
    setShowQuickPoll(true);
  };

  const handleQuickPhoto = () => {
    openImagePicker();
  };

  const handleQuickEncouragement = async () => {
    const encouragements = [
      "Bravo à tous ! 🎉",
      "Continuez comme ça ! 💪",
      "Excellent travail d'équipe ! 👏",
      "Vous êtes formidables ! ⭐",
      "Fiers de faire partie de ce groupe ! 🌟",
      "Ensemble, nous sommes plus forts ! 🤝"
    ];
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    // Basculer vers l'onglet messagerie pour voir le message
    setActiveTab('messagerie');
    
    // Envoyer le message d'encouragement
    await handleSendMessage({ content: randomEncouragement });
  };



  const insertEmoji = (emoji) => {
    const el = textAreaRef.current;
    if (!el) {
      setNewMessage((t) => `${t}${t && !t.endsWith(' ') ? ' ' : ''}${emoji}`);
      return;
    }
    const start = el.selectionStart ?? newMessage.length;
    const end = el.selectionEnd ?? newMessage.length;
    const before = newMessage.slice(0, start);
    const after = newMessage.slice(end);
    const needsSpace = before && !before.endsWith(' ');
    const value = `${before}${needsSpace ? ' ' : ''}${emoji}${after}`;
    setNewMessage(value);
    // reposition cursor after emoji
    const pos = (before.length + (needsSpace ? 1 : 0) + emoji.length);
    requestAnimationFrame(() => {
      el.focus();
      try {
        el.setSelectionRange(pos, pos);
      } catch {}
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Socket presence & messages live (protégé contre double enregistrement en dev/StrictMode)
  const listenersReadyRef = useRef(false);
  useEffect(() => {
    let s;
    let listenersBound = false;
    import('../lib/socket').then(({ connectSocket }) => {
      s = connectSocket();
      if (listenersReadyRef.current) return; // déjà enregistré
      listenersReadyRef.current = true;
      listenersBound = true;

      s.on('presence:update', ({ userId, online }) => {
        setSelectedGroup((prev) => {
          if (!prev?.membersList) return prev;
          const updated = prev.membersList.map((m) =>
            String(m._id) === String(userId) ? { ...m, online } : m
          );
          return { ...prev, membersList: updated };
        });
      });

      // typing updates par room
      s.on('typing:update', ({ groupId, userId, typing }) => {
        setTypingUsers((prev) => {
          const setForGroup = new Set(prev[groupId] || []);
          if (typing) setForGroup.add(String(userId));
          else setForGroup.delete(String(userId));
          return { ...prev, [groupId]: Array.from(setForGroup) };
        });
      });

      // nouveaux messages en temps réel
      s.on('message:new', ({ groupId, message }) => {
        setSelectedGroup((prev) => {
          if (!prev || String(prev.id) !== String(groupId)) return prev;
          setMessages((msgs) => {
            const id = message && message._id ? String(message._id) : null;
            const signature = id || `${message?.sender?._id || ''}|${message?.content || ''}|${message?.createdAt || ''}`;
            const exists = msgs.some((m) => {
              const mid = m && m._id ? String(m._id) : null;
              const sig = mid || `${m?.sender?._id || ''}|${m?.content || ''}|${m?.createdAt || ''}`;
              return sig === signature;
            });
            if (exists) return msgs;
            return [...msgs, message];
          });
          return prev;
        });
      });

      // Événements sondages en temps réel
      s.on('poll:created', ({ poll, groupId }) => {
        console.log('Nouveau sondage créé:', poll);
        // Le composant PollComponent se rechargera automatiquement
      });

      s.on('poll:voted', ({ pollId, optionIndex, poll, groupId }) => {
        console.log('Nouveau vote sur sondage:', pollId);
        // Le composant PollComponent se rechargera automatiquement
      });

      s.on('poll:closed', ({ pollId, poll, groupId }) => {
        console.log('Sondage clôturé:', pollId);
        // Le composant PollComponent se rechargera automatiquement
      });
    });
    return () => {
      if (s && listenersBound) {
        s.off('presence:update');
        s.off('typing:update');
        s.off('message:new');
        s.off('poll:created');
        s.off('poll:voted');
        s.off('poll:closed');
      }
      listenersReadyRef.current = false; // permet ré-enregistrement propre après démontage
    };
  }, []);

  // Interface de discussion
  if (!showGroupList && selectedGroup) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-100'
      }`}>
        <HeaderDashboard />
        
        <div className="flex h-[calc(100vh-80px)] gap-0">
          {/* Zone de chat principale */}
          <div className="flex-1 flex flex-col bg-white min-w-0">
            
            {/* Header ultra-compact */}
            <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {selectedGroup?.name?.charAt(0) || 'E'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">{selectedGroup?.name || 'Éco-Warriors'}</h2>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${ (selectedGroup?.membersList?.some(m => m.online) ? 'bg-green-500' : 'bg-gray-400') }`}></div>
                      {(selectedGroup?.membersList?.filter(m => m.online).length || 0)} en ligne
                    </span>
                    <span>•</span>
                    <span>{messages.length} msg</span>
                    <span>•</span>
                    <span>{selectedGroup?.stats?.totalPoints ?? 0} pts</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGroupList(true)}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs"
              >
                Retour
              </button>
            </div>



            {/* Onglets ultra-compacts */}
            <div className="bg-yellow-400 px-3 py-1">
              <div className="flex gap-0">
                <button
                  onClick={() => setActiveTab('messagerie')}
                  className={`flex-1 px-3 py-1.5 font-medium transition-all text-xs ${
                    activeTab === 'messagerie'
                      ? 'bg-yellow-500 text-yellow-900 rounded-md shadow-sm'
                      : 'text-yellow-800 hover:bg-yellow-300 rounded-md'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle size={14} />
                    <span>Messagerie</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('sondages')}
                  className={`flex-1 px-3 py-1.5 font-medium transition-all text-xs ${
                    activeTab === 'sondages'
                      ? 'bg-yellow-500 text-yellow-900 rounded-md shadow-sm'
                      : 'text-yellow-800 hover:bg-yellow-300 rounded-md'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Target size={14} />
                    <span>Sondages</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Zone de messages */}
            {activeTab === 'messagerie' && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">


                  {/* Messages dynamiques depuis l'API */}
                  {messages.map((m) => (
                    <div key={m._id} className="flex gap-3">
                      <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {(m.sender?.username || 'U').slice(0,2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-gray-900">{m.sender?.username || 'Utilisateur'}</span>
                          <span className="text-[10px] text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}) : ''}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          {m.content ? (
                            <p className="text-gray-800 text-sm">{m.content}</p>
                          ) : null}
                          {m.mediaUrl ? (
                            <img src={m.mediaUrl} alt="media" className="mt-2 max-w-xs rounded-lg border" />
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}



                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie ultra-compacte */}
                <div className="bg-yellow-400 p-2">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-yellow-500 rounded transition-colors" onClick={openImagePicker} title="Envoyer une image">
                      <Paperclip size={14} className="text-yellow-800" />
                    </button>
                    <button className="p-1 hover:bg-yellow-500 rounded transition-colors" onClick={openImagePicker} title="Prendre une photo">
                      <Camera size={14} className="text-yellow-800" />
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageSelected}
                    />

                    <div className="flex-1 relative">
                      <textarea
                        ref={textAreaRef}
                        value={newMessage}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewMessage(val);
                          // typing events debounced
                          import('../lib/socket').then(({ connectSocket }) => {
                            const s = connectSocket();
                            const gid = selectedGroup?.id;
                            if (!gid) return;
                            if (val && val.trim().length > 0) {
                              s.emit('typing:start', { groupId: gid });
                              clearTimeout(window.__typingTimeout);
                              window.__typingTimeout = setTimeout(() => {
                                s.emit('typing:stop', { groupId: gid });
                              }, 1500);
                            } else {
                              s.emit('typing:stop', { groupId: gid });
                            }
                          });
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Tapez votre message..."
                        className="w-full p-2 pr-12 bg-yellow-300 text-yellow-900 placeholder-yellow-700 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none text-sm"
                        rows="1"
                        style={{ minHeight: '36px', maxHeight: '80px' }}
                      />

                      {/* Panneau de confirmation d'image */}
                      {pendingImage && (
                        <div className="absolute left-0 right-10 -top-36 bg-white border border-yellow-300 rounded-lg shadow p-2 flex items-center gap-2">
                          <img src={pendingImageUrl} alt="aperçu" className="w-20 h-20 object-cover rounded border" />
                          <div className="flex-1">
                            <div className="text-xs text-gray-700 truncate mb-1">{pendingImage.name}</div>
                            <div className="flex gap-2">
                              <button onClick={confirmSendPendingImage} className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded">Envoyer</button>
                              <button onClick={cancelPendingImage} className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800 rounded">Annuler</button>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="absolute right-1 bottom-1 flex items-center gap-0.5">
                        <button
                          className="p-1 hover:bg-yellow-400 rounded transition-colors"
                          onClick={() => insertEmoji('😊')}
                          title="Ajouter un emoji"
                        >
                          <Smile size={14} className="text-yellow-800" />
                        </button>
                        <button
                          onClick={() => {
                            if (pendingImage) {
                              // Si une image est en attente, demander confirmation via le panneau ci-dessous
                              return;
                            }
                            handleSendMessage();
                          }}
                          disabled={sending || (!newMessage.trim() && !pendingImage)}
                          className={`p-1 rounded transition-all duration-200 ${
                            sending
                              ? 'bg-yellow-300 text-yellow-700 cursor-wait'
                              : (newMessage.trim() || pendingImage)
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm'
                                : 'bg-yellow-200 text-yellow-500 cursor-not-allowed'
                          }`}
                          title={sending ? 'Envoi...' : (pendingImage ? 'Confirmez l\'image ci-dessous' : 'Envoyer')}
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions en ligne */}
                  <div className="mt-1 flex justify-end">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setNewMessage("👍 Super !")}
                        className="px-1.5 py-0.5 bg-yellow-300 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                      >
                        👍
                      </button>
                      <button
                        onClick={() => setNewMessage("🌱 Écolo")}
                        className="px-1.5 py-0.5 bg-yellow-300 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                      >
                        🌱
                      </button>
                      <button
                        onClick={() => setNewMessage("💡 Idée")}
                        className="px-1.5 py-0.5 bg-yellow-300 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                      >
                        💡
                      </button>
                      <button
                        onClick={() => setNewMessage("❓ Comment ?")}
                        className="px-1.5 py-0.5 bg-yellow-300 hover:bg-yellow-200 text-yellow-800 text-xs rounded transition-colors"
                      >
                        ❓
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Contenu Sondages */}
            {activeTab === 'sondages' && (
              <PollComponent 
                groupId={selectedGroup?.id} 
                currentUserId={currentUserId}
                autoOpenCreate={showQuickPoll}
                onCreateFormToggle={(isOpen) => setShowQuickPoll(isOpen)}
              />
            )}
          </div>



          {/* Sidebar droite ultra-compacte */}
          <div className="w-64 bg-gray-50 border-l border-gray-200 p-3 hidden lg:block flex flex-col h-full">
            {/* Section Membres - Utilise plus d'espace */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">Membres ({selectedGroup?.membersList?.length || selectedGroup?.members || 0})</h3>
              </div>

              {/* Liste des membres qui s'étend selon l'espace disponible */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {Array.isArray(selectedGroup?.membersList) && selectedGroup.membersList.length > 0 ? (
                  selectedGroup.membersList.map((m) => {
                    const uname = m.username || m.email || 'Membre';
                    const initials = uname.slice(0,2).toUpperCase();
                    return (
                      <div key={m._id} className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors cursor-pointer shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                              {initials}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${m.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-gray-800 block truncate">{uname}</span>
                            <div className="text-[10px] text-gray-500">{m.online ? 'En ligne' : 'Hors ligne'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                          <Trophy size={10} className="text-yellow-600" />
                          <span className="text-[10px] font-bold text-yellow-800">{m.score || 0}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-gray-500 p-3 text-center bg-white rounded-lg">Aucun membre</div>
                )}
              </div>
            </div>

            {/* Actions rapides - Positionnées en bas */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Actions rapides</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleQuickPoll}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <Plus size={14} />
                  Nouveau Sondage
                </button>
                <button 
                  onClick={handleQuickPhoto}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <Camera size={14} />
                  Partager Photo
                </button>
                <button 
                  onClick={handleQuickEncouragement}
                  className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-sm"
                >
                  <Heart size={14} />
                  Encourager
                </button>
              </div>
            </div>

          </div>
        </div>
        
        {/* Section Statistiques en bas de la page */}
        <div className="mt-8 px-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                <Trophy size={28} className="text-blue-500" />
                Statistiques du Groupe
              </h2>
              <p className="text-gray-600">Performance et engagement de votre équipe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {/* Messages envoyés */}
              <div className="bg-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <MessageCircle size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Messages</span>
                      <div className="text-xs text-green-600 font-semibold">+12 récents</div>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-blue-600">247</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{width: '82%'}}></div>
                </div>
                <div className="text-sm text-gray-600">Objectif: 300 messages</div>
              </div>

              {/* Participation active */}
              <div className="bg-white rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                      <Users size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Participation</span>
                      <div className="text-xs text-green-600 font-semibold">6/8 actifs</div>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-green-600">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '87%'}}></div>
                </div>
                <div className="text-sm text-green-600 font-medium">Excellent engagement</div>
              </div>

              {/* Défis complétés */}
              <div className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <Target size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Défis</span>
                      <div className="text-xs text-purple-600 font-semibold">3 en cours</div>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-purple-600">12<span className="text-lg text-gray-500">/15</span></span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '80%'}}></div>
                </div>
                <div className="text-sm text-purple-600 font-medium">3 défis restants ce mois</div>
              </div>

              {/* Points totaux */}
              <div className="bg-white rounded-2xl p-6 border border-yellow-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                      <Trophy size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Points</span>
                      <div className="text-xs text-yellow-600 font-semibold">+85 cette semaine</div>
                    </div>
                  </div>
                  <span className="text-3xl font-bold text-yellow-600">1,450</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '72%'}}></div>
                </div>
                <div className="text-sm text-yellow-600 font-medium">Objectif: 2,000 points</div>
              </div>
            </div>

            {/* Badge de performance - Plus grand et centré */}
            <div className="bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-2xl p-8 border border-green-200 shadow-inner">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Trophy size={32} className="text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="text-2xl font-bold text-green-800 mb-2">Groupe Performant 🏆</div>
                    <div className="text-base text-green-600 mb-1">Top 5% des groupes les plus actifs</div>
                    <div className="text-sm text-gray-600">Niveau: Expert • Prochain niveau: 550 points</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-700 mb-1">#3</div>
                  <div className="text-lg text-green-600 font-semibold">Classement</div>
                  <div className="text-sm text-gray-500">sur 127 groupes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  // Interface de liste des groupes
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <HeaderDashboard />
      
      <div className="container mx-auto px-4 py-6 pt-8">
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Groupes</h1>
                <p className="text-gray-600">Rejoignez la discussion et participez aux défis de groupe</p>
              </div>
            </div>
          </div>
        </div>

        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Chargement de vos groupes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-semibold">Erreur de chargement</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste des groupes */}
        {!loading && !error && (
          <>
            {groupes.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Aucun groupe rejoint</h3>
                <p className="text-gray-600 mb-6">
                  Vous n'avez pas encore rejoint de groupe de discussion. 
                  Participez à un défi pour être automatiquement ajouté au groupe correspondant !
                </p>
                <button 
                  onClick={() => window.location.href = '/challenges'}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  Découvrir les défis
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupes.map((groupe) => {
                  const CategoryIcon = getCategoryIcon(groupe.category);
                  return (
                    <div
                      key={groupe.id}
                      className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                      onClick={() => handleGroupSelect(groupe)}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${groupe.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                            <CategoryIcon size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{groupe.name}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{groupe.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {groupe.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-gray-500" />
                              <span className="text-gray-600">{groupe.members} membres</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Trophy size={14} className="text-yellow-500" />
                              <span className="text-gray-600">{groupe.totalPoints} pts</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            Défi: {groupe.challengeTitle}
                          </div>
                        </div>

                        <button className={`w-full bg-gradient-to-r ${groupe.avatarColor} text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg`}>
                          <MessageCircle size={16} />
                          <span>Rejoindre la discussion</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MonGroupeSimple;
