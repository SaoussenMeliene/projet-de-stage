import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderDashboard from "../components/HeaderDashboard";
import SubmitProofModal from "../components/SubmitProofModal";
import {
  ArrowLeft, Calendar, Clock, Users, Target, Award, Heart, Share2,
  MessageCircle, CheckCircle, Play, Trophy, Leaf, Eye, ThumbsUp, Flag, Upload
} from "lucide-react";
import { api } from "../lib/axios";
import { participantService } from "../services/participants";
import { proofService } from "../services/proofService";

// Helpers
const fmt = (d) => (d ? new Date(d).toLocaleDateString() : "—");
const daysBetween = (a, b) => {
  if (!a || !b) return "—";
  const A = new Date(a), B = new Date(b);
  return Math.max(1, Math.ceil((B - A) / 86400000)) + " jours";
};
const categoryMeta = (raw = "") => {
  const n = raw.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (n.includes("écolog") || n.includes("ecolog")) return { 
    color: "from-green-500 to-emerald-500", 
    Icon: Leaf, 
    label: "Écologique",
    defaultImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
  };
  if (n.includes("sport")) return { 
    color: "from-purple-500 to-pink-500", 
    Icon: Trophy, 
    label: "Sportif",
    defaultImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"
  };
  if (n.includes("créat") || n.includes("creat")) return { 
    color: "from-indigo-500 to-blue-500", 
    Icon: Target, 
    label: "Créatif",
    defaultImage: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop"
  };
  if (n.includes("solid")) return { 
    color: "from-orange-500 to-amber-500", 
    Icon: Award, 
    label: "Solidaire",
    defaultImage: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop"
  };
  if (n.includes("édu") || n.includes("edu")) return { 
    color: "from-cyan-500 to-sky-500", 
    Icon: Target, 
    label: "Éducatif",
    defaultImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop"
  };
  return { 
    color: "from-gray-500 to-slate-500", 
    Icon: Target, 
    label: raw || "Défi",
    defaultImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop"
  };
};

export default function VoirDefi() {
  const params = useParams();
  const defiId = params.defiId || params.id; // Support pour différents noms de paramètres
  const navigate = useNavigate();
  
  console.log("Params reçus:", params, "DefiId final:", defiId);

  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("apercu");
  const [isParticipating, setIsParticipating] = useState(false);
  const [defi, setDefi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [showProofModal, setShowProofModal] = useState(false);
  const [needsProof, setNeedsProof] = useState(false);
  const [myProofs, setMyProofs] = useState([]);
  const [proofsLoading, setProofsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    (async () => {
      try {
        setLoading(true);

        // Sécurité : si l’id a l’air invalide (pas un ObjectId), évite l’appel
        if (!defiId || defiId.trim().length === 0) {
          setErrMsg("Identifiant invalide.");
          setLoading(false);
          return;
        }

        console.log("Tentative de récupération du défi:", `/challenges/${defiId}`);
        const data = await api.get(`/challenges/${defiId}`);
        const doc = data.item || data;

        const start = doc.startDate;
        const end   = doc.endDate;

        const meta = categoryMeta(doc.category || "");
        
        // Logique d'image intelligente
        let challengeImage = meta.defaultImage; // Image par défaut selon la catégorie
        
        const imageField = doc.image || doc.coverImage;
        if (imageField) {
          // Si le défi a une image spécifique
          if (imageField.startsWith('http')) {
            // URL complète
            challengeImage = imageField;
          } else if (imageField.startsWith('/')) {
            // Chemin relatif depuis le serveur
            challengeImage = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imageField}`;
          } else {
            // Nom de fichier seulement
            challengeImage = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${imageField}`;
          }
        }
        
        console.log("Image du défi:", challengeImage, "Image originale:", doc.image);
        
        setDefi({
          _id: doc._id,
          title: doc.title || "Défi",
          description: doc.description || "",
          categoryColor: meta.color,
          CategoryIcon: meta.Icon,
          categoryLabel: meta.label,
          difficulty: doc.difficulty || "Intermédiaire",
          duration: daysBetween(start, end),
          startDate: fmt(start),
          endDate: fmt(end),
          participants: doc.participantsCount ?? doc.participants ?? 0,
          maxParticipants: doc.capacity || doc.maxParticipants || 0,
          points: doc.rewardPoints || doc.points || 0,
          progress: 0,
          image: challengeImage,
          organizer: {
            name: doc.createdBy?.username || "Organisateur",
            avatar: (doc.createdBy?.username?.[0] || "U").toUpperCase(),
            role: "Coordinateur",
          },
          objectives: Array.isArray(doc.tasks) && doc.tasks.length
            ? doc.tasks.map((t) => (typeof t === "string" ? t : t.label))
            : ["Objectif 1", "Objectif 2"],
          rewards: [{ type: "Points", name: "Points du défi", points: doc.rewardPoints || 0 }],
          stats: { completionRate: (doc.stats?.completionRate ?? doc.progressAvg ?? 0), averageScore: (doc.stats?.averageScore ?? 0), totalImpact: "—" },
        });
        setErrMsg("");
        
        // Vérifier si l'utilisateur participe déjà à ce défi
        try {
          const participations = await participantService.getMyParticipations();
          const isAlreadyParticipating = participations.participations?.some(
            p => p.challenge?._id === defiId
          );
          setIsParticipating(isAlreadyParticipating);
          console.log(`ℹ️ Statut de participation: ${isAlreadyParticipating ? 'Participant' : 'Non participant'}`);
          
          // Si l'utilisateur participe, charger ses preuves pour ce défi
          if (isAlreadyParticipating) {
            loadMyProofs();
          }
        } catch (participationError) {
          console.log('ℹ️ Impossible de vérifier le statut de participation (utilisateur non connecté?)');
        }
        
      } catch (e) {
        const status = e.response?.status;
        const msg = e.response?.data?.msg || e.message;
        console.error("GET /challenges/:id error", { status, msg, url: `/challenges/${defiId}`, id: defiId });
        setErrMsg(status === 400 ? "Identifiant invalide."
                : status === 404 ? "Défi introuvable."
                : "Erreur serveur.");
      } finally {
        setLoading(false);
      }
    })();
  }, [defiId, navigate]);

  const loadMyProofs = async () => {
    if (!defiId) return;
    
    try {
      setProofsLoading(true);
      const response = await proofService.getMyProofsForChallenge(defiId);
      const proofs = response.proofs || [];
      setMyProofs(proofs);
      setNeedsProof(proofs.length === 0);
      console.log(`📋 ${proofs.length} preuve(s) trouvée(s) pour ce défi`);
    } catch (error) {
      console.log('ℹ️ Impossible de charger les preuves (utilisateur non connecté?)');
      setMyProofs([]);
    } finally {
      setProofsLoading(false);
    }
  };

  const handleParticipate = async () => {
    try {
      if (!defi?._id) return;
      
      if (!isParticipating) {
        // Rejoindre le défi
        console.log(`🎯 Tentative de rejoindre le défi ${defi._id}`);
        const response = await participantService.joinChallenge(defi._id);
        console.log('✅ Défi rejoint:', response);
        
        setIsParticipating(true);
        
        // Charger les preuves après avoir rejoint
        loadMyProofs();
        
        // Vérifier si une preuve est nécessaire
        if (response.needsProof) {
          setNeedsProof(true);
        }
        
        // Afficher un message de succès avec info sur le groupe et la preuve
        let message = `🎉 Défi rejoint avec succès !\n\n✅ Vous avez été automatiquement ajouté au groupe de discussion "${response.groupName || 'Groupe du défi'}"`;
        message += `\n\n📝 Vous pouvez maintenant soumettre une preuve de votre participation quand vous le souhaitez !`;
        
        alert(message);
      } else {
        // Quitter le défi
        console.log(`🚪 Tentative de quitter le défi ${defi._id}`);
        const response = await participantService.leaveChallenge(defi._id);
        console.log('✅ Défi quitté:', response);
        
        setIsParticipating(false);
        alert('👋 Vous avez quitté le défi et le groupe de discussion associé.');
      }
      
      // Rafraîchir les données du défi
      const data = await api.get(`/challenges/${defi._id}`);
      const doc = data.item || data;
      setDefi((prev) => prev ? { ...prev, participants: doc.participants || 0 } : prev);
      
    } catch (e) {
      const status = e.response?.status;
      const msg = e.response?.data?.msg || e.message;
      console.error("❌ Erreur join/leave:", { status, msg });
      
      // Messages d'erreur plus explicites
      if (status === 401) {
        alert('🔒 Vous devez être connecté pour rejoindre un défi.');
      } else if (status === 404) {
        alert('❌ Défi introuvable.');
      } else if (msg.includes('déjà inscrit')) {
        alert('ℹ️ Vous participez déjà à ce défi !');
        setIsParticipating(true);
      } else {
        alert(`❌ Erreur: ${msg}`);
      }
    }
  };

  const handleShare = () => {
    if (!defi) return;
    const shareData = { title: defi.title, text: defi.description, url: window.location.href };
    if (navigator.share) navigator.share(shareData).catch(() => {});
    else navigator.clipboard.writeText(window.location.href);
  };

  const handleJoinDiscussion = () => {
    // Naviguer vers la page "Mon Groupe" où l'utilisateur peut voir tous ses groupes
    navigate('/mon-groupe');
  };

  const handleSubmitProof = () => {
    setShowProofModal(true);
  };

  const handleProofSuccess = (response) => {
    console.log('✅ Preuve soumise avec succès:', response);
    setNeedsProof(false);
    
    // Recharger les preuves pour mettre à jour l'affichage
    loadMyProofs();
    
    alert('🎉 Preuve soumise avec succès ! Elle sera examinée par un administrateur.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderDashboard />
        <div className="max-w-6xl mx-auto px-6 py-10 text-gray-500">Chargement…</div>
      </div>
    );
  }

  if (errMsg || !defi) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HeaderDashboard />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
            <ArrowLeft size={20} /><span>Retour</span>
          </button>
          <div className="text-red-600 font-medium">{errMsg || "Défi introuvable."}</div>
        </div>
      </div>
    );
  }

  const CategoryIcon = defi.CategoryIcon;
  
  // Fonction pour gérer les erreurs d'image
  const handleImageError = (e) => {
    console.log("Erreur de chargement d'image, utilisation de l'image par défaut");
    const meta = categoryMeta(defi.categoryLabel || "");
    e.target.src = meta.defaultImage;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft size={20} /><span>Retour</span>
        </button>

        {/* En-tête du défi avec image */}
        <div className={`relative rounded-2xl overflow-hidden mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <img 
            src={defi.image} 
            alt={defi.title}
            className="w-full h-64 sm:h-80 object-cover"
            onError={handleImageError}
          />
          {/* Overlay gradient pour le texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex items-end p-6 sm:p-8">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <CategoryIcon size={16} />
                  <span className="text-sm font-medium">{defi.categoryLabel}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Trophy size={16} />
                  <span className="text-sm font-medium">{defi.difficulty}</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-lg">{defi.title}</h1>
              <p className="text-white/90 text-lg max-w-2xl drop-shadow-md">{defi.description}</p>
            </div>
          </div>
        </div>

        {/* Informations principales et actions */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Début</div>
                <div className="font-semibold">{defi.startDate}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Durée</div>
                <div className="font-semibold">{defi.duration}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Participants</div>
                <div className="font-semibold">{defi.participants}{defi.maxParticipants > 0 && `/${defi.maxParticipants}`}</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Points</div>
                <div className="font-semibold">{defi.points}</div>
              </div>
            </div>

            {/* Onglets */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: "apercu", label: "Aperçu", icon: Eye },
                    { id: "objectifs", label: "Objectifs", icon: Target },
                    { id: "recompenses", label: "Récompenses", icon: Award },
                    { id: "participants", label: "Participants", icon: Users }
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === "apercu" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description détaillée</h3>
                      <p className="text-gray-700 leading-relaxed">{defi.description}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Organisateur</h3>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {defi.organizer.avatar}
                        </div>
                        <div>
                          <div className="font-medium">{defi.organizer.name}</div>
                          <div className="text-sm text-gray-600">{defi.organizer.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "objectifs" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Objectifs à atteindre</h3>
                    <div className="space-y-3">
                      {defi.objectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "recompenses" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Récompenses</h3>
                    <div className="space-y-3">
                      {defi.rewards.map((reward, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center gap-3">
                            <Award className="w-6 h-6 text-yellow-600" />
                            <div>
                              <div className="font-medium text-gray-900">{reward.name}</div>
                              <div className="text-sm text-gray-600">{reward.type}</div>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-yellow-600">{reward.points} pts</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "participants" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Participants ({defi.participants})</h3>
                    <div className="text-gray-600">
                      {defi.participants === 0 ? (
                        <p>Aucun participant pour le moment. Soyez le premier à rejoindre ce défi !</p>
                      ) : (
                        <p>Liste des participants à venir...</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar avec actions */}
          <div className="space-y-6">
            {/* Actions principales */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleParticipate}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isParticipating
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  <Play size={18} />
                  {isParticipating ? 'Quitter le défi' : 'Rejoindre le défi'}
                </button>

                {isParticipating && (
                  <button
                    onClick={handleJoinDiscussion}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <MessageCircle size={18} />
                    Groupe de discussion
                  </button>
                )}

                {isParticipating && (
                  <div className="space-y-2">
                    <button
                      onClick={handleSubmitProof}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <Upload size={18} />
                      {myProofs.length === 0 ? 'Soumettre une preuve' : 'Ajouter une preuve'}
                    </button>
                    
                    {(() => {
                      // Si aucune preuve, afficher "Preuve non soumise"
                      if (myProofs.length === 0) {
                        return (
                          <div className="text-sm text-center text-gray-500">
                            <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            Preuve non soumise
                          </div>
                        );
                      }

                      // Prendre la preuve la plus récente
                      const latestProof = [...myProofs]
                        .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))[0];
                      const status = latestProof?.status;

                      if (status === 'approuve') {
                        return (
                          <div className="text-sm text-center">
                            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                              ✅ Preuve approuvée
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Statut: 🟢 Approuvée</div>
                          </div>
                        );
                      }

                      if (status === 'rejete') {
                        return (
                          <div className="text-sm text-center">
                            <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
                              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                              🔴 Preuve rejetée
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Statut: 🔴 Rejetée</div>
                          </div>
                        );
                      }

                      // Afficher uniquement quand status === 'en_attente'
                      if (status === 'en_attente') {
                        return (
                          <div className="text-sm text-center text-yellow-600 font-medium">
                            <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            🟡 Preuve soumise — en attente de validation
                          </div>
                        );
                      }

                      // Sécurité: si statut inattendu, considérer comme non soumise
                      return (
                        <div className="text-sm text-center text-gray-500">
                          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                          Preuve non soumise
                        </div>
                      );
                    })()}
                  </div>
                )}

                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Share2 size={18} />
                  Partager
                </button>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date de fin</span>
                  <span className="font-medium">{defi.endDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulté</span>
                  <span className="font-medium">{defi.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Catégorie</span>
                  <span className="font-medium">{defi.categoryLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">{defi.participants}</span>
                </div>
                {defi.maxParticipants > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Places restantes</span>
                    <span className="font-medium">{Math.max(0, defi.maxParticipants - defi.participants)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progression */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Taux de completion</span>
                    <span className="font-medium">{Math.max(0, Math.min(100, Math.round(defi.stats.completionRate || 0)))}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, Math.round(defi.stats.completionRate || 0)))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Score moyen</span>
                  <span className="font-medium">{Math.round(defi.stats.averageScore || 0)}/100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impact total</span>
                  <span className="font-medium">{defi.stats.totalImpact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Modal de soumission de preuve */}
      <SubmitProofModal
        isOpen={showProofModal}
        onClose={() => setShowProofModal(false)}
        challengeId={defi?._id}
        challengeTitle={defi?.title}
        onSuccess={handleProofSuccess}
      />
    </div>
  );
}
