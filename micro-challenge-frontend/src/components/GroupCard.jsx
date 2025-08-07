import React from 'react';
import { MessageCircle, UserPlus, MoreVertical, Users, Trophy, TrendingUp } from 'lucide-react';

/**
 * Composant réutilisable pour afficher une carte de groupe
 * Sépare la logique d'affichage du composant principal
 */
const GroupCard = ({ 
  group, 
  index, 
  userRole, 
  onGroupSelect, 
  onAddMember,
  className = ""
}) => {
  const handleCardClick = () => {
    onGroupSelect(group);
  };

  const handleAddMemberClick = (e) => {
    e.stopPropagation();
    onAddMember(group.id);
  };

  const handleChatClick = (e) => {
    e.stopPropagation();
    onGroupSelect(group);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Très actif':
        return 'bg-green-100 text-green-700';
      case 'Actif':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer ${className}`}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
      onClick={handleCardClick}
    >
      {/* Header de la carte */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${group.avatarColor} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {group.avatar}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">{group.nom}</h3>
              <p className="text-gray-600 text-sm">{group.description}</p>
            </div>
          </div>

          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <MoreVertical size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Statut et objectif */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(group.statut)}`}>
              {group.statut}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{group.objectif}</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={14} className="text-blue-500" />
              <span className="text-lg font-bold text-gray-800">{group.membres}</span>
            </div>
            <span className="text-xs text-gray-500">Membres</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy size={14} className="text-yellow-500" />
              <span className="text-lg font-bold text-gray-800">{group.points}</span>
            </div>
            <span className="text-xs text-gray-500">Points</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-lg font-bold text-gray-800">{group.progression}%</span>
            </div>
            <span className="text-xs text-gray-500">Progression</span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${group.avatarColor} h-2 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${group.progression}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          <button
            onClick={handleChatClick}
            className={`flex-1 bg-gradient-to-r ${group.avatarColor} text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg`}
          >
            <MessageCircle size={16} />
            <span>Rejoindre la discussion</span>
          </button>

          {userRole === 'admin' && (
            <button
              onClick={handleAddMemberClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
              title="Ajouter des membres"
            >
              <UserPlus size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
