import React, { useState, useEffect } from 'react';
import HeaderDashboard from '../components/HeaderDashboard';
import { proofService } from '../services/proofService';
import {
  Eye, Check, X, Clock, FileText, Image, Video, File,
  User, Calendar, MessageSquare, Filter, Search, ChevronDown,
  CheckCircle, XCircle, AlertCircle, Loader, Download
} from 'lucide-react';

const AdminProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('en_attente');
  const [selectedProof, setSelectedProof] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const statusLabels = {
    'en_attente': { label: 'En attente', color: 'orange', icon: Clock },
    'approuve': { label: 'Approuvé', color: 'green', icon: CheckCircle },
    'rejete': { label: 'Rejeté', color: 'red', icon: XCircle }
  };

  const typeLabels = {
    'text': { label: 'Texte', icon: FileText },
    'image': { label: 'Image', icon: Image },
    'video': { label: 'Vidéo', icon: Video },
    'file': { label: 'Fichier', icon: File }
  };

  useEffect(() => {
    loadProofs();
  }, [filter]);

  const loadProofs = async () => {
    try {
      setLoading(true);
      setError('');
      
      let response;
      if (filter === 'en_attente') {
        response = await proofService.getPendingProofs();
        setProofs(response.proofs || []);
      } else {
        response = await proofService.getAllProofs({ status: filter });
        setProofs(response.proofs || []);
      }
      
      console.log(`📊 ${response.proofs?.length || 0} preuves chargées (${filter})`);
      
    } catch (err) {
      console.error('❌ Erreur chargement preuves:', err);
      setError(err.response?.data?.msg || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProof = (proof) => {
    setSelectedProof(proof);
    setShowModal(true);
    setReviewComment('');
  };

  const handleApprove = async () => {
    if (!selectedProof) return;
    
    setActionLoading(true);
    try {
      await proofService.approveProof(selectedProof._id, reviewComment);
      console.log('✅ Preuve approuvée');
      
      // Mettre à jour la liste
      setProofs(proofs.map(p => 
        p._id === selectedProof._id 
          ? { ...p, status: 'approuve', reviewComment, reviewedAt: new Date() }
          : p
      ));
      
      setShowModal(false);
      setSelectedProof(null);
      
    } catch (err) {
      console.error('❌ Erreur approbation:', err);
      alert('Erreur lors de l\'approbation: ' + (err.response?.data?.msg || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedProof) return;
    
    setActionLoading(true);
    try {
      await proofService.rejectProof(selectedProof._id, reviewComment);
      console.log('❌ Preuve rejetée');
      
      // Mettre à jour la liste
      setProofs(proofs.map(p => 
        p._id === selectedProof._id 
          ? { ...p, status: 'rejete', reviewComment, reviewedAt: new Date() }
          : p
      ));
      
      setShowModal(false);
      setSelectedProof(null);
      
    } catch (err) {
      console.error('❌ Erreur rejet:', err);
      alert('Erreur lors du rejet: ' + (err.response?.data?.msg || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileUrl = (content) => {
    if (content.startsWith('/uploads/')) {
      return `http://localhost:5000${content}`;
    }
    return content;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderDashboard />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestion des Preuves</h1>
                <p className="text-gray-600">Validez ou rejetez les preuves soumises par les participants</p>
              </div>
              
              {/* Filtres */}
              <div className="flex gap-3">
                {Object.entries(statusLabels).map(([status, config]) => {
                  const IconComponent = config.icon;
                  return (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        filter === status
                          ? `bg-${config.color}-500 text-white shadow-lg`
                          : `bg-${config.color}-50 text-${config.color}-600 hover:bg-${config.color}-100`
                      }`}
                    >
                      <IconComponent size={16} />
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* États de chargement et d'erreur */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Chargement des preuves...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-semibold">Erreur de chargement</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
            <button 
              onClick={loadProofs}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Liste des preuves */}
        {!loading && !error && (
          <>
            {proofs.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Aucune preuve {statusLabels[filter].label.toLowerCase()}
                </h3>
                <p className="text-gray-600">
                  {filter === 'en_attente' 
                    ? 'Aucune preuve en attente de validation pour le moment.'
                    : `Aucune preuve ${statusLabels[filter].label.toLowerCase()} trouvée.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {proofs.map((proof) => {
                  const statusConfig = statusLabels[proof.status];
                  const typeConfig = typeLabels[proof.type];
                  const StatusIcon = statusConfig.icon;
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <div
                      key={proof._id}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">
                                {proof.user?.firstName} {proof.user?.lastName}
                              </h3>
                              <p className="text-gray-600 text-sm">@{proof.user?.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-${statusConfig.color}-50 text-${statusConfig.color}-600`}>
                              <StatusIcon size={14} />
                              <span className="text-sm font-medium">{statusConfig.label}</span>
                            </div>
                            
                            <button
                              onClick={() => handleViewProof(proof)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                            >
                              <Eye size={16} />
                              Examiner
                            </button>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Défi</h4>
                            <p className="text-gray-600">{proof.challenge?.title}</p>
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full mt-1">
                              {proof.challenge?.category}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Type de preuve</h4>
                            <div className="flex items-center gap-2">
                              <TypeIcon size={16} className="text-gray-500" />
                              <span className="text-gray-600">{typeConfig.label}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{proof.description}</p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            <span>Soumis le {formatDate(proof.submittedAt)}</span>
                          </div>
                          
                          {proof.reviewedAt && (
                            <div className="flex items-center gap-2">
                              <span>Traité le {formatDate(proof.reviewedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de détail et validation */}
      {showModal && selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Examiner la preuve</h2>
                <p className="text-gray-600 mt-1">
                  Soumise par {selectedProof.user?.firstName} {selectedProof.user?.lastName}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Défi</h3>
                  <p className="text-gray-600 mb-2">{selectedProof.challenge?.title}</p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {selectedProof.challenge?.category}
                  </span>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Participant</h3>
                  <p className="text-gray-600">
                    {selectedProof.user?.firstName} {selectedProof.user?.lastName}
                  </p>
                  <p className="text-gray-500 text-sm">@{selectedProof.user?.username}</p>
                  <p className="text-gray-500 text-sm">{selectedProof.user?.email}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedProof.description}</p>
              </div>

              {/* Contenu de la preuve */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Preuve</h3>
                
                {selectedProof.type === 'text' ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProof.content}</p>
                  </div>
                ) : selectedProof.type === 'image' ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img 
                      src={getFileUrl(selectedProof.content)} 
                      alt="Preuve"
                      className="max-w-full h-auto rounded-lg shadow-md"
                    />
                    {selectedProof.fileName && (
                      <p className="text-sm text-gray-500 mt-2">📎 {selectedProof.fileName}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">{selectedProof.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {selectedProof.fileSize && `${(selectedProof.fileSize / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                      <a
                        href={getFileUrl(selectedProof.content)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        <Download size={14} />
                        Télécharger
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Commentaire de validation */}
              {selectedProof.status === 'en_attente' && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Commentaire (optionnel)</h3>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ajoutez un commentaire pour expliquer votre décision..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
              )}

              {/* Commentaire existant */}
              {selectedProof.reviewComment && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Commentaire de validation</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedProof.reviewComment}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedProof.status === 'en_attente' && (
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader size={20} className="animate-spin" /> : <X size={20} />}
                  Rejeter
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? <Loader size={20} className="animate-spin" /> : <Check size={20} />}
                  Approuver
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProofs;