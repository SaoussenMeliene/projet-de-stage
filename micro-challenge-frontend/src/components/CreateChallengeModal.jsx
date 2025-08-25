import React, { useState } from 'react';
import { X, Save, Target, Calendar, Users, Award, Upload, Image } from 'lucide-react';
import { api } from '../lib/axios';

const CreateChallengeModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'Écologique',
    difficulte: 'Facile',
    duree: '7',
    objectif: '',
    recompense: '',
    instructions: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = null;
      
      // Upload de l'image si elle existe
      if (formData.image) {
        const imageFormData = new FormData();
        imageFormData.append('image', formData.image);
        
        try {
          const uploadResponse = await api.post('/upload', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = uploadResponse.url || uploadResponse.filename;
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          alert('Erreur lors de l\'upload de l\'image. Le défi sera créé sans image.');
        }
      }

      // Mapper les catégories vers les valeurs attendues par l'API
      const categoryMap = {
        'Écologique': 'Écologique',
        'Sportif': 'Sportif',
        'Solidaire': 'Solidaire',
        'Bien-être': 'Bien-être',
        'Créatif': 'Créatif',
        'Éducatif': 'Éducatif'
      };

      // Créer le défi
      const challengeData = {
        title: formData.titre,
        description: formData.description,
        category: categoryMap[formData.categorie] || formData.categorie,
        difficulty: formData.difficulte,
        startDate: new Date(),
        endDate: new Date(Date.now() + parseInt(formData.duree) * 24 * 60 * 60 * 1000),
        image: imageUrl,
        rewardPoints: 100, // Points par défaut
        tasks: formData.objectif ? [formData.objectif] : []
      };

      const response = await api.post('/challenges', challengeData);
      
      // Notifier le parent du succès
      if (onSave) {
        onSave(response);
      }
      
      alert('Défi créé avec succès !');
      onClose();
      
      // Reset form
      setFormData({
        titre: '',
        description: '',
        categorie: 'Écologique',
        difficulte: 'Facile',
        duree: '7',
        objectif: '',
        recompense: '',
        instructions: '',
        image: null
      });
      setImagePreview(null);
      
    } catch (error) {
      console.error('Erreur création défi:', error);
      alert('Erreur lors de la création du défi: ' + (error.response?.data?.msg || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB.');
        return;
      }

      setFormData({
        ...formData,
        image: file
      });

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
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

          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image du défi
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Upload className="text-blue-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Cliquez pour ajouter une image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF jusqu'à 5MB
                    </p>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {formData.image?.name}
                </div>
              </div>
            )}
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
                <option value="Solidaire">Solidaire</option>
                <option value="Écologique">Écologique</option>
                <option value="Créatif">Créatif</option>
                <option value="Sportif">Sportif</option>
                <option value="Éducatif">Éducatif</option>
                <option value="Bien-être">Bien-être</option>
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
              disabled={uploading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-colors ${
                uploading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Créer le défi
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className={`px-6 py-3 rounded-xl transition-colors ${
                uploading 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
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
