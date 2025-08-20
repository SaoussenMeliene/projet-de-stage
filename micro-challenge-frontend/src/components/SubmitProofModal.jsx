import React, { useState } from 'react';
import { X, Upload, FileText, Image, Video, File, Send, Loader } from 'lucide-react';
import { proofService } from '../services/proofService';

const SubmitProofModal = ({ isOpen, onClose, challengeId, challengeTitle, onSuccess }) => {
  const [proofType, setProofType] = useState('text');
  const [description, setDescription] = useState('');
  const [textContent, setTextContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const proofTypes = [
    { value: 'text', label: 'Texte', icon: FileText, description: 'Description textuelle de votre participation' },
    { value: 'image', label: 'Image', icon: Image, description: 'Photo prouvant votre participation' },
    { value: 'video', label: 'Vidéo', icon: Video, description: 'Vidéo de votre participation' },
    { value: 'file', label: 'Fichier', icon: File, description: 'Document ou autre fichier' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('Le fichier ne peut pas dépasser 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) {
      setError('La description est requise');
      return;
    }

    if (proofType === 'text' && !textContent.trim()) {
      setError('Le contenu textuel est requis');
      return;
    }

    if (proofType !== 'text' && !selectedFile) {
      setError('Un fichier est requis pour ce type de preuve');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const proofData = {
        type: proofType,
        description: description.trim(),
        textContent: textContent.trim(),
        file: selectedFile
      };

      const response = await proofService.submitProof(challengeId, proofData);
      
      console.log('✅ Preuve soumise:', response);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
      // Réinitialiser le formulaire
      setDescription('');
      setTextContent('');
      setSelectedFile(null);
      setProofType('text');
      
      onClose();
      
    } catch (err) {
      console.error('❌ Erreur soumission preuve:', err);
      setError(err.response?.data?.msg || 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setTextContent('');
    setSelectedFile(null);
    setProofType('text');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Soumettre une preuve</h2>
            <p className="text-gray-600 mt-1">Pour le défi: {challengeTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type de preuve */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Type de preuve
            </label>
            <div className="grid grid-cols-2 gap-3">
              {proofTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setProofType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      proofType === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent size={20} />
                      <span className="font-medium">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description de votre participation *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez comment vous avez participé à ce défi..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          {/* Contenu selon le type */}
          {proofType === 'text' ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contenu textuel *
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Détaillez votre participation, vos actions, vos résultats..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={5}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fichier * (Max 10MB)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept={
                    proofType === 'image' ? 'image/*' :
                    proofType === 'video' ? 'video/*' :
                    '*/*'
                  }
                  className="hidden"
                  id="proof-file"
                  required
                />
                <label htmlFor="proof-file" className="cursor-pointer">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  {selectedFile ? (
                    <div>
                      <p className="text-green-600 font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-600 font-medium">Cliquez pour sélectionner un fichier</p>
                      <p className="text-sm text-gray-500">
                        {proofType === 'image' && 'JPG, PNG, GIF'}
                        {proofType === 'video' && 'MP4, MOV, AVI'}
                        {proofType === 'file' && 'PDF, DOC, DOCX, etc.'}
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Soumettre la preuve
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProofModal;