import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Loader } from 'lucide-react';
import { userService, groupService } from '../services/groupService';

const AddMemberModal = ({ isOpen, onClose, groupId, onMemberAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Recherche d'utilisateurs avec debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchUsers = async () => {
    try {
      setIsSearching(true);
      const users = await userService.searchUsers(searchQuery);
      setSearchResults(users);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u._id === user._id);
      if (isSelected) {
        return prev.filter(u => u._id !== user._id);
      } else {
        return [...prev, user];
      }
    });
  };

  const addSelectedMembers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setIsAdding(true);
      
      // Ajouter chaque utilisateur sélectionné
      for (const user of selectedUsers) {
        await groupService.addMemberToGroup(groupId, user._id);
      }

      // Notifier le parent que des membres ont été ajoutés
      onMemberAdded();
      
      // Réinitialiser et fermer
      setSelectedUsers([]);
      setSearchQuery('');
      setSearchResults([]);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'ajout des membres:', error);
      alert('Erreur lors de l\'ajout des membres');
    } finally {
      setIsAdding(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ajouter des membres</h2>
                <p className="text-purple-100 text-sm">Recherchez et ajoutez des collaborateurs au groupe</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Barre de recherche */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Utilisateurs sélectionnés */}
          {selectedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Utilisateurs sélectionnés ({selectedUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{user.username}</span>
                    <button
                      onClick={() => toggleUserSelection(user)}
                      className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Résultats de recherche */}
          <div className="max-h-64 overflow-y-auto">
            {searchQuery.trim().length < 2 ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Tapez au moins 2 caractères pour rechercher</p>
              </div>
            ) : searchResults.length === 0 && !isSearching ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun utilisateur trouvé</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => {
                  const isSelected = selectedUsers.some(u => u._id === user._id);
                  return (
                    <div
                      key={user._id}
                      onClick={() => toggleUserSelection(user)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{user.username}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Annuler
          </button>
          <button
            onClick={addSelectedMembers}
            disabled={selectedUsers.length === 0 || isAdding}
            className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
              selectedUsers.length === 0 || isAdding
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105'
            }`}
          >
            {isAdding ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Ajout en cours...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Ajouter {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
