import React, { useState, useEffect, useRef } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
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
  Heart
} from "lucide-react";

const MonGroupeSimple = () => {
  const [activeTab, setActiveTab] = useState('messagerie');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [showGroupList, setShowGroupList] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const messagesEndRef = useRef(null);

  const groupes = [
    {
      id: 1,
      name: "Éco-Warriors",
      description: "Groupe dédié aux défis écologiques",
      members: 6,
      avatarColor: "from-green-400 to-blue-500"
    },
    {
      id: 2,
      name: "Tech Innovators",
      description: "Défis technologiques et innovation",
      members: 8,
      avatarColor: "from-purple-400 to-pink-500"
    }
  ];

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setShowGroupList(false);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        content: newMessage,
        author: 'Vous',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Interface de discussion
  if (!showGroupList && selectedGroup) {
    return (
      <div className="min-h-screen bg-gray-100">
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
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                      6 en ligne
                    </span>
                    <span>•</span>
                    <span>247 msg</span>
                    <span>•</span>
                    <span>1,450 pts</span>
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
                  {/* Messages ultra-compacts */}
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                      MD
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-bold text-gray-900">Marie Dubois</span>
                        <span className="text-xs text-gray-500">14:30</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1 py-0.5 rounded">Leader</span>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <p className="text-gray-800 text-sm leading-snug">Salut tout le monde ! J'ai trouvé une super astuce pour réduire les emballages au supermarché 🌱</p>

                        {/* Réactions compactes */}
                        <div className="flex items-center gap-1 mt-1.5">
                          <button className="flex items-center gap-0.5 px-1 py-0.5 bg-blue-50 hover:bg-blue-100 rounded text-xs">
                            <span>👍</span>
                            <span className="text-blue-600 font-medium">4</span>
                          </button>
                          <button className="flex items-center gap-0.5 px-1 py-0.5 bg-green-50 hover:bg-green-100 rounded text-xs">
                            <span>🌱</span>
                            <span className="text-green-600 font-medium">3</span>
                          </button>
                          <button className="p-0.5 hover:bg-gray-100 rounded">
                            <Plus size={8} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message de Thomas */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      TM
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-green-600 cursor-pointer">Thomas Martin</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:32</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <p className="text-gray-800 leading-relaxed">Partage-nous ça Marie ! J'ai encore du mal avec les fruits et légumes... 🤔</p>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-yellow-50 hover:bg-yellow-100 rounded-full transition-colors text-xs">
                            <span>🤔</span>
                            <span className="text-yellow-600 font-medium">2</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message d'Emma avec photo */}
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      ER
                    </div>
                    <div className="flex-1 max-w-2xl">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-gray-900 hover:text-pink-600 cursor-pointer">Emma Rousseau</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">14:35</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <p className="text-gray-800 leading-relaxed mb-4">Voici mes sacs réutilisables ! Ils sont parfaits pour les courses 🛍️</p>

                        {/* Image simulée */}
                        <div className="relative group/image">
                          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-dashed border-pink-200 text-center hover:border-pink-400 transition-all duration-300 cursor-pointer transform hover:scale-105">
                            <ImageIcon className="w-12 h-12 text-pink-400 mx-auto mb-3 group-hover/image:scale-110 transition-transform" />
                            <span className="text-sm text-pink-600 font-semibold">sacs_reutilisables.jpg</span>
                            <p className="text-xs text-pink-500 mt-1">Cliquez pour agrandir</p>
                          </div>
                        </div>

                        {/* Réactions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          <button className="flex items-center gap-1 px-2 py-1 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors text-xs">
                            <span>💕</span>
                            <span className="text-pink-600 font-medium">6</span>
                          </button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 rounded-full transition-colors text-xs">
                            <span>♻️</span>
                            <span className="text-green-600 font-medium">4</span>
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                            <Plus size={12} className="text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages dynamiques */}
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-4 group ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-12 h-12 ${message.isOwn ? 'bg-yellow-500' : 'bg-gray-500'} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {message.isOwn ? 'ME' : 'U'}
                      </div>
                      <div className={`flex-1 max-w-2xl ${message.isOwn ? 'flex flex-col items-end' : ''}`}>
                        <div className={`flex items-center gap-3 mb-2 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                          <span className={`text-sm font-bold ${message.isOwn ? 'text-yellow-700' : 'text-gray-900'}`}>
                            {message.author}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{message.time}</span>
                        </div>
                        <div className={`${message.isOwn ? 'bg-yellow-400 text-yellow-900' : 'bg-white'} p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300`}>
                          <p className={`${message.isOwn ? 'text-yellow-900' : 'text-gray-800'} leading-relaxed`}>
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie ultra-compacte */}
                <div className="bg-yellow-400 p-2">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-yellow-500 rounded transition-colors">
                      <Paperclip size={14} className="text-yellow-800" />
                    </button>
                    <button className="p-1 hover:bg-yellow-500 rounded transition-colors">
                      <Camera size={14} className="text-yellow-800" />
                    </button>

                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tapez votre message..."
                        className="w-full p-2 pr-12 bg-yellow-300 text-yellow-900 placeholder-yellow-700 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-none text-sm"
                        rows="1"
                        style={{ minHeight: '36px', maxHeight: '80px' }}
                      />

                      <div className="absolute right-1 bottom-1 flex items-center gap-0.5">
                        <button className="p-1 hover:bg-yellow-400 rounded transition-colors">
                          <Smile size={14} className="text-yellow-800" />
                        </button>
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className={`p-1 rounded transition-all duration-200 ${
                            newMessage.trim()
                              ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-sm'
                              : 'bg-yellow-200 text-yellow-500 cursor-not-allowed'
                          }`}
                        >
                          <Send size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur et suggestions ultra-compacts */}
                  <div className="mt-1 flex items-center justify-between">
                    <div className="text-xs text-yellow-700 flex items-center gap-1">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-0.5 bg-yellow-600 rounded-full animate-bounce"></div>
                        <div className="w-0.5 h-0.5 bg-yellow-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-0.5 h-0.5 bg-yellow-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span>Thomas écrit...</span>
                    </div>

                    {/* Suggestions en ligne */}
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
              <div className="flex-1 p-6 bg-gray-50">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target size={32} className="text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun sondage actif</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Créez votre premier sondage pour recueillir l'avis des membres du groupe !
                  </p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Créer un sondage
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar droite ultra-compacte */}
          <div className="w-64 bg-gray-50 border-l border-gray-200 p-2 hidden lg:block">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-800">Membres (8)</h3>
              </div>

              <div className="space-y-1 max-h-48 overflow-y-auto">
                {/* Marie Dubois - Leader ultra-compact */}
                <div className="flex items-center justify-between p-1.5 bg-blue-50 rounded hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        MD
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                      <div className="absolute -top-0.5 -left-0.5 w-2 h-2 bg-yellow-400 rounded-full flex items-center justify-center">
                        <span style={{fontSize: '8px'}}>👑</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-800">Marie Dubois</span>
                      <div className="text-xs text-blue-600">Leader</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-yellow-600">250pts</span>
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
                    <span className="text-xs font-bold text-yellow-800">185pts</span>
                  </div>
                </div>

                {/* Sophie Laurent */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        SL
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Sophie Laurent</span>
                      <div className="text-xs text-orange-600">Absent • Il y a 2h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">220pts</span>
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
                    <span className="text-xs font-bold text-yellow-800">145pts</span>
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
                    <span className="text-xs font-bold text-yellow-800">195pts</span>
                  </div>
                </div>

                {/* Lucas Bernard */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        LB
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Lucas Bernard</span>
                      <div className="text-xs text-gray-500">Hors ligne • Il y a 1j</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">120pts</span>
                  </div>
                </div>

                {/* Camille Moreau */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        CM
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Camille Moreau</span>
                      <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-yellow-600" />
                    <span className="text-xs font-bold text-yellow-800">175pts</span>
                  </div>
                </div>

                {/* Vous */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        ME
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-blue-800">Vous</span>
                      <div className="text-xs text-blue-600">En ligne</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg">
                    <Trophy size={12} className="text-blue-600" />
                    <span className="text-xs font-bold text-blue-800">160pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides ultra-compactes */}
            <div className="mb-3">
              <h3 className="text-sm font-bold text-gray-800 mb-2">Actions rapides</h3>
              <div className="space-y-1">
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1">
                  <Plus size={12} />
                  Sondage
                </button>
                <button className="w-full bg-blue-400 hover:bg-blue-500 text-white font-medium py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1">
                  <Camera size={12} />
                  Photo
                </button>
                <button className="w-full bg-pink-400 hover:bg-pink-500 text-white font-medium py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1">
                  <Heart size={12} />
                  Encourager
                </button>
              </div>
            </div>

            {/* Statistiques ultra-compactes */}
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1">
                <Trophy size={12} className="text-blue-500" />
                Statistiques
              </h3>

              <div className="space-y-2">
                {/* Messages envoyés - compact */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1">
                      <MessageCircle size={12} className="text-blue-500" />
                      <span className="text-xs font-medium text-gray-700">Messages</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">247</span>
                      <div className="text-xs text-green-600">+12</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '82%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500">Objectif: 300</div>
                </div>

                {/* Participation active */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-green-500" />
                      <span className="text-sm font-semibold text-gray-700">Participation active</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">87%</span>
                      <div className="text-xs text-green-600 font-medium">6/8 membres actifs</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '87%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Excellent niveau d'engagement</div>
                </div>

                {/* Défis complétés */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">Défis complétés</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-purple-600">12/15</span>
                      <div className="text-xs text-purple-600 font-medium">3 en cours</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '80%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">3 défis restants ce mois</div>
                </div>

                {/* Points totaux */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">Points totaux</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-yellow-600">1,450</span>
                      <div className="text-xs text-yellow-600 font-medium">+85 cette semaine</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '72%'}}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Objectif: 2,000 points</div>
                </div>
              </div>

              {/* Badge de performance */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-green-800">Groupe Performant 🏆</div>
                    <div className="text-xs text-green-600">Top 5% des groupes les plus actifs</div>
                    <div className="text-xs text-gray-600 mt-1">Niveau: Expert • Prochain niveau: 550 points</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">#3</div>
                    <div className="text-xs text-green-600">Classement</div>
                  </div>
                </div>
              </div>

              {/* Activité récente */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-800 mb-3">Activité récente</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Marie a complété le défi "Zéro déchet"</span>
                    <span className="text-gray-400">• Il y a 2h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Thomas a partagé une photo</span>
                    <span className="text-gray-400">• Il y a 4h</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Nouveau membre: Camille Moreau</span>
                    <span className="text-gray-400">• Hier</span>
                  </div>
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
    <div className="min-h-screen bg-gray-100">
      <HeaderDashboard />
      
      <div className="container mx-auto px-4 py-8">
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupes.map((groupe) => (
            <div
              key={groupe.id}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleGroupSelect(groupe)}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${groupe.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {groupe.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{groupe.name}</h3>
                    <p className="text-gray-600 text-sm">{groupe.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-sm text-gray-600">{groupe.members} membres</span>
                </div>

                <button className={`w-full bg-gradient-to-r ${groupe.avatarColor} text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg`}>
                  <MessageCircle size={16} />
                  <span>Rejoindre la discussion</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonGroupeSimple;
