import React from 'react';
import { X } from 'lucide-react';

const CreateRewardModal = ({ 
  isOpen, 
  onClose, 
  rewardForm, 
  setRewardForm, 
  onSubmit 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Créer une nouvelle récompense</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la récompense *
            </label>
            <input
              type="text"
              value={rewardForm.name}
              onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})}
              placeholder="Ex: Bon d'achat 50€"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={rewardForm.description}
              onChange={(e) => setRewardForm({...rewardForm, description: e.target.value})}
              placeholder="Description de la récompense..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points requis *
            </label>
            <input
              type="number"
              value={rewardForm.points}
              onChange={(e) => setRewardForm({...rewardForm, points: e.target.value})}
              placeholder="Ex: 100"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock disponible
            </label>
            <input
              type="number"
              value={rewardForm.stock || 1}
              onChange={(e) => setRewardForm({...rewardForm, stock: e.target.value})}
              placeholder="Ex: 10"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={rewardForm.category}
              onChange={(e) => setRewardForm({...rewardForm, category: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Général">Général</option>
              <option value="Bien-être">Bien-être</option>
              <option value="Shopping">Shopping</option>
              <option value="Expérience">Expérience</option>
              <option value="Formation">Formation</option>
              <option value="Restauration">Restauration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emoji/Image
            </label>
            <input
              type="text"
              value={rewardForm.image}
              onChange={(e) => setRewardForm({...rewardForm, image: e.target.value})}
              placeholder="Ex: 🎁 (ou laisser vide)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rareté
              </label>
              <select
                value={rewardForm.rarity}
                onChange={(e) => setRewardForm({...rewardForm, rarity: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="common">Commun</option>
                <option value="rare">Rare</option>
                <option value="epic">Épique</option>
                <option value="legendary">Légendaire</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={rewardForm.status}
                onChange={(e) => setRewardForm({...rewardForm, status: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onSubmit}
            disabled={!rewardForm.name.trim() || !rewardForm.points}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Créer la récompense
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardModal;