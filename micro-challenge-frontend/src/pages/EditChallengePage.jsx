import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Save, ArrowLeft, Upload, Target, Calendar, Users, Award } from 'lucide-react';
import { api } from '../lib/axios';
import HeaderDashboard from '../components/HeaderDashboard';

const EditChallengePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [challenge, setChallenge] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Écologique',
    difficulty: 'Facile',
    startDate: '',
    endDate: '',
    rewardPoints: 100,
    image: null,
    tasks: []
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  // Charger les données du défi
  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const response = await api.get(`/challenges/${id}`);
        const challengeData = response.data || response;
        
        setChallenge(challengeData);
        
        // Pré-remplir le formulaire
        setFormData({
          title: challengeData.title || '',
          description: challengeData.description || '',
          category: challengeData.category || 'Écologique',
          difficulty: challengeData.difficulty || 'Facile',
          startDate: challengeData.startDate ? new Date(challengeData.startDate).toISOString().split('T')[0] : '',
          endDate: challengeData.endDate ? new Date(challengeData.endDate).toISOString().split('T')[0] : '',
          rewardPoints: challengeData.rewardPoints || 100,
          tasks: challengeData.tasks || []
        });
        
        // Si il y a une image existante
        if (challengeData.image) {
          const imageUrl = challengeData.image.startsWith('/uploads/') 
            ? `http://localhost:5000${challengeData.image}`
            : challengeData.image;
          setImagePreview(imageUrl);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('❌ Erreur chargement défi:', error);
        alert('Erreur lors du chargement du défi');
        navigate('/admin-dashboard');
      }
    };

    if (id) {
      loadChallenge();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      let imageUrl = challenge?.image || null;
      
      // Upload de la nouvelle image si elle existe
      if (newImageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', newImageFile);
        
        try {
          const uploadResponse = await api.post('/upload', imageFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = uploadResponse.url || uploadResponse.filename;
        } catch (uploadError) {
          console.error('Erreur upload image:', uploadError);
          alert('Erreur lors de l\'upload de l\'image. Le défi sera modifié sans la nouvelle image.');
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

      // Préparer les données à envoyer
      const updateData = {
        title: formData.title,
        description: formData.description,
        category: categoryMap[formData.category] || formData.category,
        difficulty: formData.difficulty,
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        rewardPoints: parseInt(formData.rewardPoints) || 100,
        tasks: formData.tasks
      };

      // Ajouter l'image seulement si elle a changé ou existe
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const response = await api.put(`/challenges/${id}`, updateData);
      
      alert('Défi modifié avec succès !');
      navigate('/admin-dashboard');
      
    } catch (error) {
      console.error('Erreur modification défi:', error);
      alert('Erreur lors de la modification du défi: ' + (error.response?.data?.msg || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

      setNewImageFile(file);

      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
  };

  const addTask = () => {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, '']
    }));
  };

  const updateTask = (index, value) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => i === index ? value : task)
    }));
  };

  const removeTask = (index) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du défi...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Défi non trouvé</p>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/admin-dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Target className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Modifier le défi</h1>
                <p className="text-gray-600">ID: {id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Informations de base */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Target size={20} />
                Informations de base
              </h2>

              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du défi *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
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
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez le défi en quelques phrases..."
                />
              </div>
            </div>

            {/* Upload d'image */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Upload size={20} />
                Image du défi
              </h2>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Upload className="text-blue-600 w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Cliquez pour ajouter une image
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, GIF jusqu'à 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu du défi"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded text-sm">
                    {newImageFile ? newImageFile.name : 'Image actuelle'}
                  </div>
                  
                  {/* Bouton pour changer l'image */}
                  <div className="mt-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="change-image"
                    />
                    <label
                      htmlFor="change-image"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <Upload size={16} />
                      Changer l'image
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Paramètres du défi */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Award size={20} />
                Paramètres du défi
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    name="category"
                    value={formData.category}
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

                {/* Difficulté */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulté
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Facile">Facile</option>
                    <option value="Moyen">Moyen</option>
                    <option value="Difficile">Difficile</option>
                  </select>
                </div>

                {/* Date de début */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Points de récompense */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points de récompense
                </label>
                <input
                  type="number"
                  name="rewardPoints"
                  value={formData.rewardPoints}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Tâches */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users size={20} />
                  Tâches du défi
                </h2>
                <button
                  type="button"
                  onClick={addTask}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  + Ajouter une tâche
                </button>
              </div>

              {formData.tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune tâche définie</p>
                  <p className="text-sm">Cliquez sur "Ajouter une tâche" pour commencer</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTask(index, e.target.value)}
                          placeholder={`Tâche ${index + 1}`}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-colors ${
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium`}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Enregistrer les modifications
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                disabled={saving}
                className={`px-8 py-3 rounded-xl transition-colors ${
                  saving 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } font-medium`}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditChallengePage;