import React, { useState } from 'react';
import { X, Save, Target, Calendar, Users, Award } from 'lucide-react';

const CreateChallengeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'Environnement',
    difficulte: 'Facile',
    duree: '7',
    objectif: '',
    recompense: '',
    instructions: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newChallenge = {
      id: Date.now(),
      ...formData,
      participants: 0,
      statut: 'Actif',
      dateCreation: new Date().toISOString().split('T')[0]
    };

    onSave(newChallenge);
    onClose();
    
    // Reset form
    setFormData({
      titre: '',
      description: '',
      categorie: 'Environnement',
      difficulte: 'Facile',
      duree: '7',
      objectif: '',
      recompense: '',
      instructions: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Target className="text-blue-600 w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Créer un nouveau défi</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du défi *
            </label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Défi Zéro Déchet"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez le défi en quelques phrases..."
            />
          </div>

          {/* Catégorie et Difficulté */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Environnement">Environnement</option>
                <option value="Sport">Sport</option>
                <option value="Social">Social</option>
                <option value="Bien-être">Bien-être</option>
                <option value="Créativité">Créativité</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulté
              </label>
              <select
                name="difficulte"
                value={formData.difficulte}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </div>

          {/* Durée et Objectif */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée (jours)
              </label>
              <input
                type="number"
                name="duree"
                value={formData.duree}
                onChange={handleChange}
                min="1"
                max="365"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectif
              </label>
              <input
                type="text"
                name="objectif"
                value={formData.objectif}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Réduire de 50% ses déchets"
              />
            </div>
          </div>

          {/* Récompense */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Récompense
            </label>
            <input
              type="text"
              name="recompense"
              value={formData.recompense}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Badge Éco-Warrior + 100 points"
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions détaillées
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expliquez comment participer au défi, les règles, les critères de validation..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Save size={18} />
              Créer le défi
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallengeModal;
