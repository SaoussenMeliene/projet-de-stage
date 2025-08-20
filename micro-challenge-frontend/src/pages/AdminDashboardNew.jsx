import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  CheckCircle,
  UserCheck,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Award,
  Shield,
  Settings,
  BarChart3,
  FileText,
  Clock,
  AlertCircle,
  X
} from "lucide-react";
import HeaderDashboard from "../components/HeaderDashboard";
import CreateChallengeModal from "../components/CreateChallengeModal";
import { proofService } from "../services/proofService";
import { api } from "../lib/axios";

const AdminDashboardNew = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // États pour les défis
  const [defis, setDefis] = useState([]);
  const [filteredDefis, setFilteredDefis] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('Toutes les catégories');
  const [statusFilter, setStatusFilter] = useState('Tous les statuts');
  const [sortBy, setSortBy] = useState('recent');
  
  // États pour les statistiques
  const [stats, setStats] = useState({
    totalDefis: { value: 0, change: '+0 ce mois', trend: 'up' },
    utilisateurs: { value: 0, change: '+0 ce mois', trend: 'up' },
    preuvesAttente: { value: 0, change: 'À valider', trend: 'warning' },
    groupesActifs: { value: 0, change: '+0 ce mois', trend: 'up' }
  });
  
  // États pour les preuves
  const [preuves, setPreuves] = useState([]);
  const [preuveLoading, setPreuveLoading] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fonction pour charger les défis
  const loadChallenges = async () => {
    try {
      const response = await api.get('/challenges');
      console.log('📊 Réponse API complète:', response.data);
      
      // L'API retourne {items: [...], pagination: {...}}
      const challengesData = response.data?.items || response.data?.challenges || response.data || [];
      console.log(`📊 ${challengesData.length} défis chargés`);
      
      // Mettre à jour les états
      setDefis(challengesData);
      
      // Forcer l'affichage de tous les défis immédiatement
      setFilteredDefis(challengesData);
      console.log('📊 Défis mis en état et affichés immédiatement');
      
      // Debug des catégories
      if (challengesData.length > 0) {
        console.log('📊 Catégories trouvées:');
        challengesData.forEach(defi => {
          console.log(`- "${defi.title}": "${defi.category}"`);
        });
        
        const uniqueCategories = [...new Set(challengesData.map(d => d.category).filter(Boolean))];
        console.log('📊 Catégories uniques:', uniqueCategories);
      }
    } catch (error) {
      console.error('❌ Erreur chargement défis:', error);
      setDefis([]);
      setFilteredDefis([]);
    }
  };

  // Fonction pour charger les statistiques
  const loadStats = async () => {
    try {
      const [challengesRes, proofsRes] = await Promise.all([
        api.get('/challenges/stats'),
        proofService.getPendingProofs()
      ]);
      
      const challengeStats = challengesRes.data || {};
      const pendingProofs = proofsRes.proofs || [];
      
      setStats({
        totalDefis: { 
          value: challengeStats.all || 0, 
          change: `+${challengeStats.active || 0} actifs`, 
          trend: 'up' 
        },
        utilisateurs: { 
          value: 156, // TODO: Ajouter API pour les utilisateurs
          change: '+12 ce mois', 
          trend: 'up' 
        },
        preuvesAttente: { 
          value: pendingProofs.length, 
          change: 'À valider', 
          trend: 'warning' 
        },
        groupesActifs: { 
          value: 12, // TODO: Ajouter API pour les groupes
          change: '+1 ce mois', 
          trend: 'up' 
        }
      });
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
    }
  };

  // Fonction pour charger les preuves en attente
  const loadPendingProofs = async () => {
    try {
      setPreuveLoading(true);
      const response = await proofService.getPendingProofs();
      setPreuves(response.proofs || []);
      console.log(`📊 ${response.proofs?.length || 0} preuves en attente chargées`);
    } catch (error) {
      console.error('❌ Erreur chargement preuves:', error);
      setPreuves([]);
    } finally {
      setPreuveLoading(false);
    }
  };

  // Fonction de filtrage et tri des défis
  const applyFilters = () => {
    let filtered = [...defis];
    
    console.log('🔍 Filtrage - Défis initiaux:', filtered.length);
    console.log('🔍 Filtres actifs:', { searchTerm, categoryFilter, statusFilter, sortBy });
    
    // Si aucun défi n'est chargé, ne pas filtrer
    if (filtered.length === 0) {
      console.log('⚠️ Aucun défi à filtrer');
      setFilteredDefis([]);
      return;
    }
    
    // AFFICHER TOUS LES DÉFIS PAR DÉFAUT (sans filtrage)
    if (!searchTerm.trim() && 
        categoryFilter === 'Toutes les catégories' && 
        statusFilter === 'Tous les statuts') {
      console.log('✅ Affichage de tous les défis (aucun filtre actif)');
      setFilteredDefis(filtered);
      return;
    }
    
    // Filtrage par recherche
    if (searchTerm.trim()) {
      filtered = filtered.filter(defi => 
        defi.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        defi.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Après recherche:', filtered.length);
    }
    
    // Filtrage par catégorie
    if (categoryFilter && categoryFilter !== 'Toutes les catégories') {
      const originalLength = filtered.length;
      console.log(`🔍 Filtrage par catégorie: "${categoryFilter}"`);
      
      filtered = filtered.filter(defi => {
        if (!defi.category) {
          console.log('⚠️ Défi sans catégorie:', defi.title);
          return false;
        }
        
        const defiCategory = defi.category.toLowerCase().trim();
        const filterCategory = categoryFilter.toLowerCase().trim();
        
        console.log(`🔍 Comparaison: "${defiCategory}" vs "${filterCategory}"`);
        
        // Correspondance directe (maintenant que les valeurs correspondent)
        const match = defiCategory === filterCategory;
        
        console.log(`${match ? '✅' : '❌'} Correspondance: "${defiCategory}" === "${filterCategory}" = ${match}`);
        return match;
      });
      console.log(`🔍 Après filtrage catégorie: ${originalLength} → ${filtered.length}`);
    }
    
    // Filtrage par statut
    if (statusFilter !== 'Tous les statuts') {
      const now = new Date();
      filtered = filtered.filter(defi => {
        const start = defi.startDate ? new Date(defi.startDate) : null;
        const end = defi.endDate ? new Date(defi.endDate) : null;
        
        if (statusFilter === 'Actif') {
          return (!start || now >= start) && (!end || now <= end);
        } else if (statusFilter === 'À venir') {
          return start && now < start;
        } else if (statusFilter === 'Terminé') {
          return end && now > end;
        }
        return true;
      });
      console.log('🔍 Après filtrage statut:', filtered.length);
    }
    
    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt || b.dateCreation) - new Date(a.createdAt || a.dateCreation);
        case 'popular':
          return (b.participantsCount || 0) - (a.participantsCount || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        default:
          return 0;
      }
    });
    
    console.log('🔍 Défis finaux après tri:', filtered.length);
    if (filtered.length > 0) {
      console.log('🔍 Premier défi:', { title: filtered[0].title, category: filtered[0].category });
    }
    
    setFilteredDefis(filtered);
  };

  // Fonction pour supprimer un défi
  const handleDeleteChallenge = async (challengeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce défi ?')) {
      return;
    }
    
    try {
      await api.delete(`/challenges/${challengeId}`);
      await loadChallenges(); // Recharger la liste
      console.log('✅ Défi supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur suppression défi:', error);
      alert('Erreur lors de la suppression du défi');
    }
  };

  // Vérification des droits d'administration et chargement initial
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    // Chargement initial des données
    const initializeData = async () => {
      await Promise.all([
        loadChallenges(),
        loadStats()
      ]);
      setLoading(false);
    };
    
    initializeData();
  }, [navigate]);

  // Charger les preuves quand on change d'onglet
  useEffect(() => {
    if (activeTab === 'validation') {
      loadPendingProofs();
    }
  }, [activeTab]);

  // Appliquer les filtres quand les données ou filtres changent
  useEffect(() => {
    console.log('🔄 useEffect applyFilters déclenché:', {
      defisLength: defis.length,
      searchTerm,
      categoryFilter,
      statusFilter,
      sortBy
    });
    applyFilters();
  }, [defis, searchTerm, categoryFilter, statusFilter, sortBy]);





  // Données de démonstration pour les utilisateurs
  const utilisateurs = [
    {
      id: 1,
      nom: "Ahmed Bhk",
      email: "ahmed@satoripop.com",
      role: "collaborateur",
      statut: "Actif",
      dateInscription: "2024-03-15",
      defisCompletes: 5
    },
    {
      id: 2,
      nom: "Marie Dupont",
      email: "marie@satoripop.com",
      role: "collaborateur",
      statut: "Actif",
      dateInscription: "2024-01-20",
      defisCompletes: 8
    },
    {
      id: 3,
      nom: "Julien Martin",
      email: "julien@satoripop.com",
      role: "admin",
      statut: "Actif",
      dateInscription: "2024-02-10",
      defisCompletes: 12
    }
  ];

  // Fonctions de gestion des preuves
  const handleViewProof = (proof) => {
    setSelectedProof(proof);
    setShowProofModal(true);
  };

  const handleApproveProof = async (proofId, comment = '') => {
    try {
      setActionLoading(true);
      await proofService.approveProof(proofId, comment);
      console.log('✅ Preuve approuvée');
      
      // Recharger les preuves
      await loadPendingProofs();
      setShowProofModal(false);
      setSelectedProof(null);
      
    } catch (error) {
      console.error('❌ Erreur approbation:', error);
      alert('Erreur lors de l\'approbation: ' + (error.response?.data?.msg || error.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProof = async (proofId, comment = '') => {
    try {
      setActionLoading(true);
      await proofService.rejectProof(proofId, comment);
      console.log('❌ Preuve rejetée');
      
      // Recharger les preuves
      await loadPendingProofs();
      setShowProofModal(false);
      setSelectedProof(null);
      
    } catch (error) {
      console.error('❌ Erreur rejet:', error);
      alert('Erreur lors du rejet: ' + (error.response?.data?.msg || error.message));
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

  // Fonction pour sauvegarder un nouveau défi
  const handleSaveChallenge = async (newChallenge) => {
    console.log('✅ Nouveau défi créé:', newChallenge);
    // Recharger les défis et statistiques
    await loadChallenges();
    await loadStats();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du panneau d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Header Admin */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Administrateur du tableau de bord</h1>
              <p className="text-gray-600">Gérez les défis, validez les épreuves et administrez les utilisateurs</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Panneau d\'administration', icon: BarChart3 },
              { id: 'defis', label: 'Défis', icon: Target },
              { id: 'validation', label: 'Validation', icon: CheckCircle },
              { id: 'utilisateurs', label: 'Utilisateurs', icon: Users },
              { id: 'groupes', label: 'Groupes', icon: UserCheck }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Target className="text-blue-600 w-6 h-6" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stats.totalDefis.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.totalDefis.value}</h3>
                <p className="text-gray-600">Total Défis</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="text-green-600 w-6 h-6" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stats.utilisateurs.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.utilisateurs.value}</h3>
                <p className="text-gray-600">Utilisateurs</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="text-orange-600 w-6 h-6" />
                  </div>
                  <span className="text-sm text-orange-600 font-medium">{stats.preuvesAttente.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.preuvesAttente.value}</h3>
                <p className="text-gray-600">Preuves en attente</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="text-purple-600 w-6 h-6" />
                  </div>
                  <span className="text-sm text-green-600 font-medium">{stats.groupesActifs.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">{stats.groupesActifs.value}</h3>
                <p className="text-gray-600">Groupes Actifs</p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Actions rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('defis')}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Plus className="text-blue-600 w-5 h-5" />
                  <span className="font-medium text-blue-800">Créer un nouveau défi</span>
                </button>
                <button 
                  onClick={() => setActiveTab('validation')}
                  className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                >
                  <CheckCircle className="text-orange-600 w-5 h-5" />
                  <span className="font-medium text-orange-800">Valider les preuves</span>
                </button>
                <button 
                  onClick={() => setActiveTab('utilisateurs')}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                >
                  <Users className="text-green-600 w-5 h-5" />
                  <span className="font-medium text-green-800">Gérer les utilisateurs</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Défis */}
        {activeTab === 'defis' && (
          <div className="space-y-6">
            {/* Header avec bouton créer */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Défis</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Créer un défi
              </button>
            </div>

            {/* Filtres et recherche */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un défi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Toutes les catégories">Toutes les catégories</option>
                  <option value="écologique">Écologique</option>
                  <option value="solidaire">Solidaire</option>
                  <option value="creatif">Créatif</option>
                  <option value="sportif">Sportif</option>
                  <option value="educatif">Éducatif</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Tous les statuts">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="À venir">À venir</option>
                  <option value="Terminé">Terminé</option>
                </select>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Plus récents</option>
                  <option value="popular">Plus populaires</option>
                  <option value="alphabetical">Alphabétique</option>
                </select>
              </div>
              
              {/* Résultats de recherche */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {filteredDefis.length} défi{filteredDefis.length > 1 ? 's' : ''} trouvé{filteredDefis.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                  <span className="ml-2 text-gray-400">
                    (Total: {defis.length})
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {/* Bouton afficher tous */}
                  <button
                    onClick={() => {
                      console.log('👁️ Affichage forcé de TOUS les défis');
                      setFilteredDefis([...defis]); // Force l'affichage de tous les défis
                    }}
                    className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 rounded text-green-600"
                  >
                    👁️ Tous les défis
                  </button>
                  
                  {/* Bouton reset filtres */}
                  <button
                    onClick={() => {
                      console.log('🔄 Reset des filtres');
                      setSearchTerm('');
                      setCategoryFilter('Toutes les catégories');
                      setStatusFilter('Tous les statuts');
                      setSortBy('recent');
                      setFilteredDefis([...defis]); // Force l'affichage de tous les défis
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-600"
                  >
                    🔄 Reset
                  </button>
                  
                  {/* Bouton debug temporaire */}
                  <button
                    onClick={() => {
                      console.log('🐛 DEBUG - État actuel:');
                      console.log('- defis:', defis.length);
                      console.log('- filteredDefis:', filteredDefis.length);
                      console.log('- categoryFilter:', categoryFilter);
                      console.log('- statusFilter:', statusFilter);
                      console.log('- searchTerm:', searchTerm);
                      if (defis.length > 0) {
                        console.log('- Premier défi:', defis[0]);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
                  >
                    🐛 Debug
                  </button>
                </div>
              </div>
            </div>

            {/* Tableau des défis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Défis Existants</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Titre</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Catégorie</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Difficulté</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Participants</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDefis.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          <div>
                            {defis.length === 0 ? 'Aucun défi trouvé' : 'Aucun défi ne correspond aux filtres'}
                            <div className="text-xs mt-2 text-gray-400">
                              Debug: defis={defis.length}, filteredDefis={filteredDefis.length}
                            </div>
                            <button
                              onClick={() => {
                                console.log('🐛 DEBUG TABLEAU:');
                                console.log('- defis:', defis);
                                console.log('- filteredDefis:', filteredDefis);
                                console.log('- categoryFilter:', categoryFilter);
                                console.log('- statusFilter:', statusFilter);
                              }}
                              className="mt-2 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 rounded"
                            >
                              🐛 Debug Tableau
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDefis.map((defi) => {
                        // Calculer le statut du défi
                        const now = new Date();
                        const start = defi.startDate ? new Date(defi.startDate) : null;
                        const end = defi.endDate ? new Date(defi.endDate) : null;
                        
                        let status = 'Actif';
                        let statusColor = 'bg-green-100 text-green-800';
                        
                        if (start && now < start) {
                          status = 'À venir';
                          statusColor = 'bg-yellow-100 text-yellow-800';
                        } else if (end && now > end) {
                          status = 'Terminé';
                          statusColor = 'bg-gray-100 text-gray-800';
                        }
                        
                        return (
                          <tr key={defi._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div>
                                <div className="font-medium text-gray-800">{defi.title}</div>
                                <div className="text-sm text-gray-500 line-clamp-2">{defi.description}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                {defi.category || 'Non définie'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                {defi.difficulty || 'Moyen'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-800">
                              {defi.participantsCount || 0}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${statusColor}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => navigate(`/challenges/${defi._id}`)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Voir le défi"
                                >
                                  <Eye size={16} />
                                </button>
                                <button 
                                  onClick={() => navigate(`/admin/challenges/${defi._id}/edit`)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Modifier le défi"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteChallenge(defi._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Supprimer le défi"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Validation */}
        {activeTab === 'validation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Validation des Preuves</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle size={16} />
                <span>{preuves.length} preuves en attente</span>
              </div>
            </div>

            {/* États de chargement */}
            {preuveLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Chargement des preuves...</p>
              </div>
            )}

            {/* Liste des preuves en attente */}
            {!preuveLoading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800">Preuves en attente de validation</h3>
                </div>

                {preuves.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune preuve en attente</h3>
                    <p className="text-gray-600">Toutes les preuves ont été traitées.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {preuves.map((preuve) => (
                      <div key={preuve._id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FileText className="text-blue-600 w-6 h-6" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800">{preuve.challenge?.title}</h4>
                                <p className="text-sm text-gray-600">
                                  Soumis par {preuve.user?.firstName} {preuve.user?.lastName} (@{preuve.user?.username})
                                </p>
                              </div>
                            </div>
                            <div className="mb-3">
                              <p className="text-sm text-gray-700 line-clamp-2">{preuve.description}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Type: {preuve.type === 'text' ? 'Texte' : preuve.type === 'image' ? 'Image' : preuve.type === 'video' ? 'Vidéo' : 'Fichier'}</span>
                              <span>•</span>
                              <span>Soumis le {formatDate(preuve.submittedAt)}</span>
                              <span>•</span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                {preuve.challenge?.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleApproveProof(preuve._id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Approuver
                            </button>
                            <button 
                              onClick={() => handleRejectProof(preuve._id)}
                              disabled={actionLoading}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              Rejeter
                            </button>
                            <button 
                              onClick={() => handleViewProof(preuve)}
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              Voir détails
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Onglet Utilisateurs */}
        {activeTab === 'utilisateurs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors">
                <Plus size={18} />
                Inviter un utilisateur
              </button>
            </div>

            {/* Filtres utilisateurs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tous les rôles</option>
                  <option>Admin</option>
                  <option>Collaborateur</option>
                </select>
                <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tous les statuts</option>
                  <option>Actif</option>
                  <option>Inactif</option>
                  <option>Suspendu</option>
                </select>
              </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Liste des utilisateurs</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Rôle</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Défis complétés</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {utilisateurs.map((utilisateur) => (
                      <tr key={utilisateur.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {utilisateur.nom.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{utilisateur.nom}</div>
                              <div className="text-sm text-gray-500">Inscrit le {new Date(utilisateur.dateInscription).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-800">{utilisateur.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            utilisateur.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {utilisateur.role === 'admin' ? 'Administrateur' : 'Collaborateur'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            {utilisateur.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Award className="text-yellow-500 w-4 h-4" />
                            <span className="font-medium text-gray-800">{utilisateur.defisCompletes}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye size={16} />
                            </button>
                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <Edit3 size={16} />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Settings size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Groupes */}
        {activeTab === 'groupes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Groupes</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                <Plus size={18} />
                Créer un groupe
              </button>
            </div>

            {/* Statistiques des groupes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="text-purple-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Groupes Actifs</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">12</p>
                <p className="text-sm text-green-600">+1 ce mois</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="text-blue-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Membres Total</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">156</p>
                <p className="text-sm text-green-600">+12 ce mois</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-green-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Engagement Moyen</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">78%</p>
                <p className="text-sm text-green-600">+5% ce mois</p>
              </div>
            </div>

            {/* Liste des groupes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Groupes existants</h3>
              </div>

              <div className="p-6">
                <div className="text-center py-12">
                  <UserCheck className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun groupe pour le moment</h3>
                  <p className="text-gray-600 mb-6">Créez votre premier groupe pour commencer à organiser vos collaborateurs</p>
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                    Créer le premier groupe
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de création de défi */}
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveChallenge}
      />

      {/* Modal de détail des preuves */}
      {showProofModal && selectedProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Détail de la preuve</h2>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations générales */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Informations générales</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Défi :</span>
                    <span className="font-medium">{selectedProof.challenge?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Utilisateur :</span>
                    <span className="font-medium">
                      {selectedProof.user?.firstName} {selectedProof.user?.lastName} (@{selectedProof.user?.username})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type :</span>
                    <span className="font-medium">
                      {selectedProof.type === 'text' ? 'Texte' : 
                       selectedProof.type === 'image' ? 'Image' : 
                       selectedProof.type === 'video' ? 'Vidéo' : 'Fichier'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Soumis le :</span>
                    <span className="font-medium">{formatDate(selectedProof.submittedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">{selectedProof.description}</p>
                </div>
              </div>

              {/* Contenu de la preuve */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Contenu de la preuve</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {selectedProof.type === 'text' ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedProof.content}</p>
                  ) : selectedProof.type === 'image' ? (
                    <img 
                      src={getFileUrl(selectedProof.content)} 
                      alt="Preuve" 
                      className="max-w-full h-auto rounded-lg"
                    />
                  ) : selectedProof.type === 'video' ? (
                    <video 
                      src={getFileUrl(selectedProof.content)} 
                      controls 
                      className="max-w-full h-auto rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">{selectedProof.fileName}</p>
                        <p className="text-sm text-gray-600">
                          {selectedProof.fileSize ? `${(selectedProof.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Taille inconnue'}
                        </p>
                      </div>
                      <a 
                        href={getFileUrl(selectedProof.content)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                      >
                        Télécharger
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleApproveProof(selectedProof._id, 'Preuve validée par l\'administrateur')}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {actionLoading ? 'Traitement...' : '✅ Approuver'}
                </button>
                <button
                  onClick={() => handleRejectProof(selectedProof._id, 'Preuve insuffisante ou non conforme')}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
                >
                  {actionLoading ? 'Traitement...' : '❌ Rejeter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardNew;
