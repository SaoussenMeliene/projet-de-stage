import React, { useState, useEffect } from 'react';
import { Gift, Star, Coins, ShoppingCart, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { api } from '../lib/axios';

const RewardsSection = ({ userPoints, onPointsUpdate }) => {
  const [rewards, setRewards] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [showClaims, setShowClaims] = useState(false);

  useEffect(() => {
    fetchRewards();
    fetchMyClaims();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await api.get('/rewards');
      setRewards(response.data.rewards || []);
    } catch (error) {
      console.error('Erreur récupération récompenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClaims = async () => {
    try {
      const response = await api.get('/rewards/my-claims');
      setMyClaims(response.data.claims || []);
    } catch (error) {
      console.error('Erreur récupération mes échanges:', error);
    }
  };

  const handleClaimReward = async (rewardId) => {
    if (claimingId) return;

    try {
      setClaimingId(rewardId);
      const response = await api.post(`/rewards/${rewardId}/claim`);
      
      // Afficher le message de succès
      alert(response.data.message);
      
      // Mettre à jour les points de l'utilisateur
      onPointsUpdate();
      
      // Recharger les données
      await fetchRewards();
      await fetchMyClaims();
      
    } catch (error) {
      console.error('Erreur échange récompense:', error);
      alert(error.response?.data?.message || 'Erreur lors de l\'échange');
    } finally {
      setClaimingId(null);
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Écologique': return '🌱';
      case 'Sportif': return '⚽';
      case 'Créatif': return '🎨';
      case 'Éducatif': return '📚';
      case 'Solidaire': return '🤝';
      case 'Bien-être': return '🧘‍♀️';
      default: return '🎁';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'delivered': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'delivered': return 'Livré';
      default: return 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Gift className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Boutique de récompenses</h3>
            <p className="text-sm text-gray-600">Échangez vos points contre des récompenses</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-yellow-700">{userPoints} points</span>
          </div>
          
          <button
            onClick={() => setShowClaims(!showClaims)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Mes échanges ({myClaims.length})
          </button>
        </div>
      </div>

      {/* Mes échanges - Section dépliable */}
      {showClaims && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-800 mb-3">Mes échanges récents</h4>
          {myClaims.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun échange effectué</p>
          ) : (
            <div className="space-y-3">
              {myClaims.slice(0, 3).map((claim) => (
                <div key={claim._id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryIcon(claim.rewardItem.category)}</span>
                    <div>
                      <p className="font-medium text-gray-800">{claim.rewardItem.title}</p>
                      <p className="text-sm text-gray-500">{claim.pointsSpent} points</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusIcon(claim.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                      {getStatusText(claim.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Liste des récompenses disponibles */}
      {rewards.length === 0 ? (
        <div className="text-center py-8">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune récompense disponible pour le moment</p>
          <p className="text-sm text-gray-400 mt-1">Les administrateurs n'ont pas encore créé de récompenses</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rewards.map((reward) => (
            <div key={reward._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              {/* Image ou icône de catégorie */}
              <div className="flex items-center justify-center h-16 mb-3 bg-gray-50 rounded-lg">
                {reward.image ? (
                  <img src={reward.image} alt={reward.title} className="h-12 w-12 object-cover rounded" />
                ) : (
                  <span className="text-3xl">{getCategoryIcon(reward.category)}</span>
                )}
              </div>

              {/* Informations */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-1">{reward.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                
                {/* Prix */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-yellow-600">{reward.pointsCost} points</span>
                </div>

                {/* Bouton d'échange */}
                <button
                  onClick={() => handleClaimReward(reward._id)}
                  disabled={userPoints < reward.pointsCost || claimingId === reward._id}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                    userPoints >= reward.pointsCost && claimingId !== reward._id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {claimingId === reward._id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Échange...
                    </span>
                  ) : userPoints >= reward.pointsCost ? (
                    'Échanger'
                  ) : (
                    'Points insuffisants'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RewardsSection;