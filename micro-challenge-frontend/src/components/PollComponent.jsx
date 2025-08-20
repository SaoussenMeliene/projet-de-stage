import React, { useState, useEffect } from 'react';
import { pollService } from '../services/pollService';
import { 
  Target, 
  Plus, 
  X, 
  Check, 
  Users, 
  Clock, 
  BarChart3,
  Loader,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PollComponent = ({ groupId, currentUserId, autoOpenCreate = false, onCreateFormToggle }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [voting, setVoting] = useState({});

  // État du formulaire de création
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  // Charger les sondages du groupe
  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Chargement des sondages pour le groupe:', groupId);
      
      const response = await pollService.getGroupPolls(groupId);
      console.log('✅ Réponse API sondages:', response);
      
      setPolls(response.polls || []);
    } catch (err) {
      console.error('❌ Erreur chargement sondages:', err);
      console.error('❌ Détails erreur:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      
      setError(err.error || err.msg || err.message || 'Erreur lors du chargement des sondages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      loadPolls();
    }
  }, [groupId]);

  // Gérer l'ouverture automatique du formulaire de création
  useEffect(() => {
    if (autoOpenCreate && !showCreateForm) {
      setShowCreateForm(true);
      if (onCreateFormToggle) {
        onCreateFormToggle(true);
      }
    }
  }, [autoOpenCreate, showCreateForm, onCreateFormToggle]);

  // Ajouter une option au formulaire
  const addOption = () => {
    if (newPoll.options.length < 6) {
      setNewPoll(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  // Supprimer une option
  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  // Mettre à jour une option
  const updateOption = (index, value) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  // Créer un sondage
  const handleCreatePoll = async () => {
    if (!newPoll.question.trim()) {
      alert('Veuillez saisir une question');
      return;
    }

    const validOptions = newPoll.options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Veuillez saisir au moins 2 options');
      return;
    }

    try {
      setCreating(true);
      await pollService.createGroupPoll(groupId, {
        question: newPoll.question.trim(),
        options: validOptions
      });

      // Réinitialiser le formulaire
      setNewPoll({ question: '', options: ['', ''] });
      setShowCreateForm(false);
      if (onCreateFormToggle) {
        onCreateFormToggle(false);
      }
      
      // Recharger les sondages
      await loadPolls();
    } catch (err) {
      console.error('Erreur création sondage:', err);
      alert(err.error || err.message || 'Erreur lors de la création du sondage');
    } finally {
      setCreating(false);
    }
  };

  // Voter sur un sondage
  const handleVote = async (pollId, optionIndex) => {
    try {
      setVoting(prev => ({ ...prev, [pollId]: true }));
      await pollService.voteOnPoll(pollId, optionIndex);
      
      // Recharger les sondages pour mettre à jour les résultats
      await loadPolls();
    } catch (err) {
      console.error('Erreur vote:', err);
      alert(err.msg || err.error || err.message || 'Erreur lors du vote');
    } finally {
      setVoting(prev => ({ ...prev, [pollId]: false }));
    }
  };

  // Clôturer un sondage
  const handleClosePoll = async (pollId) => {
    if (!confirm('Êtes-vous sûr de vouloir clôturer ce sondage ?')) return;

    try {
      await pollService.closePoll(pollId);
      await loadPolls();
    } catch (err) {
      console.error('Erreur clôture sondage:', err);
      alert(err.error || err.message || 'Erreur lors de la clôture du sondage');
    }
  };

  // Calculer le pourcentage de votes
  const getVotePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-center py-16">
          <Loader className="animate-spin text-blue-500" size={32} />
          <span className="ml-3 text-gray-600">Chargement des sondages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 bg-gray-50">
        <div className="text-center py-16">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Erreur</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadPolls}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      {/* Header avec bouton créer */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Target size={20} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Sondages du groupe</h2>
            <p className="text-sm text-gray-600">{polls.length} sondage{polls.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Plus size={16} />
            Créer un sondage
          </button>
        )}
      </div>

      {/* Formulaire de création */}
      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Nouveau sondage</h3>
            <button
              onClick={() => {
                setShowCreateForm(false);
                if (onCreateFormToggle) {
                  onCreateFormToggle(false);
                }
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question du sondage
              </label>
              <input
                type="text"
                value={newPoll.question}
                onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Ex: Quelle activité préférez-vous ?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={200}
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options de réponse
              </label>
              <div className="space-y-2">
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={100}
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              {newPoll.options.length < 6 && (
                <button
                  onClick={addOption}
                  className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus size={14} />
                  Ajouter une option
                </button>
              )}
            </div>

            {/* Boutons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleCreatePoll}
                disabled={creating}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Création...
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    Créer le sondage
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  if (onCreateFormToggle) {
                    onCreateFormToggle(false);
                  }
                }}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des sondages */}
      {polls.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target size={32} className="text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun sondage actif</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Créez votre premier sondage pour recueillir l'avis des membres du groupe !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            const isCreator = poll.createdBy._id === currentUserId;
            
            return (
              <div key={poll._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {/* Header du sondage */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {poll.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-gray-400">
                        par {poll.createdBy.username}
                      </span>
                    </div>
                  </div>
                  
                  {poll.isClosed && (
                    <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                      Clôturé
                    </div>
                  )}
                </div>

                {/* Options de vote */}
                <div className="space-y-3 mb-4">
                  {poll.options.map((option, index) => {
                    const percentage = getVotePercentage(option.votes, totalVotes);
                    const hasVoted = poll.hasVoted;
                    const userVoted = poll.userVoteIndex === index;
                    
                    return (
                      <div key={index} className="relative">
                        <button
                          onClick={() => handleVote(poll._id, index)}
                          disabled={hasVoted || poll.isClosed || voting[poll._id]}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            userVoted
                              ? 'border-blue-500 bg-blue-50'
                              : hasVoted || poll.isClosed
                              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {userVoted && <CheckCircle size={16} className="text-blue-500" />}
                              <span className={`font-medium ${userVoted ? 'text-blue-700' : 'text-gray-700'}`}>
                                {option.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">
                                {option.votes} vote{option.votes !== 1 ? 's' : ''}
                              </span>
                              <span className="text-sm font-medium text-gray-700">
                                {percentage}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Barre de progression */}
                          {totalVotes > 0 && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  userVoted ? 'bg-blue-500' : 'bg-gray-400'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Actions */}
                {isCreator && !poll.isClosed && (
                  <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleClosePoll(poll._id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                    >
                      Clôturer le sondage
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PollComponent;