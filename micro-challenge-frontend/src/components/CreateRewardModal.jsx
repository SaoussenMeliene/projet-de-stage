import React, { useState } from 'react';
import { X, Gift, Upload, AlertCircle } from 'lucide-react';

/**
 * Modal de création et d'édition de récompenses
 */
const CreateRewardModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  rewardForm, 
  setRewardForm, 
  editingReward = null,
  loading = false 
}) => {
  const [imagePreview, setImagePreview] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setRewardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image doit faire moins de 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        handleInputChange('image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!rewardForm.name?.trim()) {
      alert('Le nom de la récompense est obligatoire');
      return false;
    }
    if (!rewardForm.description?.trim()) {
      alert('La description est obligatoire');
      return false;
    }
    if (!rewardForm.points || rewardForm.points < 1) {
      alert('Le nombre de points doit être supérieur à 0');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {editingReward ? 'Modifier la récompense' : 'Créer une nouvelle récompense'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom de la récompense */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la récompense *
                </label>
                <input
                  type="text"
                  value={rewardForm.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ex: Bon cadeau Amazon 25€"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Points requis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points requis *
                </label>
                <input
                  type="number"
                  value={rewardForm.points || ''}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value) || '')}
                  placeholder="250"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={rewardForm.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="shopping">Shopping</option>
                  <option value="alimentaire">Alimentaire</option>
                  <option value="loisirs">Loisirs</option>
                  <option value="voyage">Voyage</option>
                  <option value="ecologique">Écologique</option>
                  <option value="local">Local</option>
                </select>
              </div>

              {/* Rareté */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rareté
                </label>
                <select
                  value={rewardForm.rarity || 'common'}
                  onChange={(e) => handleInputChange('rarity', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="common">Commune</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Épique</option>
                  <option value="legendary">Légendaire</option>
                </select>
              </div>

              {/* Stock disponible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock disponible
                </label>
                <input
                  type="number"
                  value={rewardForm.stock || ''}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || '')}
                  placeholder="Laissez vide pour illimité"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={rewardForm.status || 'active'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="active">Disponible</option>
                  <option value="inactive">Indisponible</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={rewardForm.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez la récompense, ses conditions d'utilisation..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {/* Upload d'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de la récompense
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-400 transition-colors">
                <div className="space-y-1 text-center">
                  {imagePreview || rewardForm.image ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview || rewardForm.image}
                        alt="Aperçu"
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                      <span>{imagePreview || rewardForm.image ? 'Changer l\'image' : 'Télécharger une image'}</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG jusqu'à 5MB</p>
                </div>
              </div>
            </div>

            {/* Avertissement */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Conseils pour une bonne récompense :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Choisissez un nom clair et attractif</li>
                  <li>Ajoutez une image de qualité pour attirer l'attention</li>
                  <li>Décrivez précisément les conditions d'utilisation</li>
                  <li>Définissez un prix en points équitable</li>
                </ul>
              </div>
            </div>
          </form>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sauvegarde...' : (editingReward ? 'Modifier la récompense' : 'Créer la récompense')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRewardModal;