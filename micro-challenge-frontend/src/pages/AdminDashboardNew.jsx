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
  X,
  Gift
} from "lucide-react";
import HeaderDashboard from "../components/HeaderDashboard";
import CreateChallengeModal from "../components/CreateChallengeModal";
import { proofService } from "../services/proofService";
import { rewardService } from "../services/rewardService";
import { userService } from "../services/userService";
import { api } from "../lib/axios";

const AdminDashboardNew = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [recompenses, setRecompenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // États pour les défis
  const [defis, setDefis] = useState([]);
  const [filteredDefis, setFilteredDefis] = useState([]);
  
  // États pour les utilisateurs
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filteredUtilisateurs, setFilteredUtilisateurs] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  
  // États pour les actions utilisateurs
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const [showInviteUserModal, setShowInviteUserModal] = useState(false);
  const [userActionLoading, setUserActionLoading] = useState(false);
  
  // États pour l'édition d'utilisateur
  const [userEditForm, setUserEditForm] = useState({
    nom: '',
    email: '',
    role: 'collaborateur',
    statut: 'Actif'
  });
  
  // États pour l'invitation d'utilisateur
  const [inviteForm, setInviteForm] = useState({
    email: '',
    nom: '',
    role: 'collaborateur'
  });
  
  // États pour les groupes
  const [groupes, setGroupes] = useState([]);
  const [filteredGroupes, setFilteredGroupes] = useState([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [groupChallengeFilter, setGroupChallengeFilter] = useState('');
  const [groupLoading, setGroupLoading] = useState(false);
  
  // États pour les actions groupes
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [groupActionLoading, setGroupActionLoading] = useState(false);
  
  // États pour l'édition de groupe
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: 'actif'
  });
  
  // États pour la gestion des membres
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // États pour la création de groupe
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [createGroupForm, setCreateGroupForm] = useState({
    name: '',
    description: '',
    challengeId: ''
  });

  // États pour les récompenses
  const [filteredRecompenses, setFilteredRecompenses] = useState([]);
  const [recompenseSearchTerm, setRecompenseSearchTerm] = useState('');
  const [recompenseLoading, setRecompenseLoading] = useState(false);
  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);
  const [rewardStats, setRewardStats] = useState({
    actives: 0,
    obtenues: 0,
    pointsDistribues: 0
  });
  
  // États pour la création/édition de récompense
  const [rewardForm, setRewardForm] = useState({
    name: '',
    description: '',
    points: '',
    category: '',
    image: '',
    rarity: 'common',
    status: 'active'
  });
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
      const responseData = await api.get('/challenges?limit=100'); // Récupérer tous les défis (limite élevée)
      
      // Essayer différentes structures de réponse
      let challengesData = [];
      
      if (Array.isArray(responseData)) {
        challengesData = responseData;
      } else if (responseData?.items && Array.isArray(responseData.items)) {
        challengesData = responseData.items;
      } else if (responseData?.challenges && Array.isArray(responseData.challenges)) {
        challengesData = responseData.challenges;
      } else if (responseData?.data && Array.isArray(responseData.data)) {
        challengesData = responseData.data;
      }
      
      // Mettre à jour les états
      setDefis(challengesData);
      setFilteredDefis(challengesData);
      
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
          value: utilisateurs.length || 0,
          change: `${utilisateurs.filter(u => u.role === 'admin').length} admins`, 
          trend: 'up' 
        },
        preuvesAttente: { 
          value: pendingProofs.length, 
          change: 'À valider', 
          trend: 'warning' 
        },
        groupesActifs: { 
          value: groupes.filter(g => g.status === 'actif').length || 0,
          change: `${groupes.length} total`, 
          trend: 'up' 
        }
      });
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
    }
  };

  // Mettre à jour les stats quand les données changent
  useEffect(() => {
    if (utilisateurs.length > 0 || groupes.length > 0) {
      loadStats();
    }
  }, [utilisateurs, groupes]);

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
      
      // Si aucun défi n'est chargé, retourner un tableau vide
      if (filtered.length === 0) {
        setFilteredDefis([]);
        return;
      }
      
      // Filtrage par recherche (titre et description)
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(defi => 
          defi.title?.toLowerCase().includes(searchLower) ||
          defi.description?.toLowerCase().includes(searchLower)
        );
      }
      
      // Filtrage par catégorie
      if (categoryFilter && categoryFilter !== 'Toutes les catégories') {
        filtered = filtered.filter(defi => {
          if (!defi.category) return false;
          
          // Normalisation des catégories pour comparaison
          const defiCategory = defi.category.trim().toLowerCase();
          const filterCategory = categoryFilter.trim().toLowerCase();
          
          // Correspondance exacte (insensible à la casse)
          if (defiCategory === filterCategory) {
            return true;
          }
          
          // Correspondance avec des variantes communes
          const categoryMappings = {
            'solidaire': ['solidaire', 'social', 'communautaire', 'entraide'],
            'écologique': ['écologique', 'environnement', 'environnemental', 'écologiques', 'nature'],
            'créatif': ['créatif', 'créativité', 'art', 'artistique', 'créative'],
            'sportif': ['sportif', 'sport', 'fitness', 'physique', 'sportive'],
            'éducatif': ['éducatif', 'éducation', 'apprentissage', 'formation', 'éducative'],
            'bien-être': ['bien-être', 'bien être', 'santé', 'relaxation', 'méditation', 'sérénité']
          };
          
          // Chercher dans les mappings
          const mappingsForFilter = categoryMappings[filterCategory] || [filterCategory];
          return mappingsForFilter.some(variant => 
            defiCategory.includes(variant) || variant.includes(defiCategory)
          );
        });
      }
      
      // Filtrage par statut
      if (statusFilter !== 'Tous les statuts') {
        const now = new Date();
        filtered = filtered.filter(defi => {
          const start = defi.startDate ? new Date(defi.startDate) : null;
          const end = defi.endDate ? new Date(defi.endDate) : null;
          
          switch (statusFilter) {
            case 'Actif':
              return (!start || now >= start) && (!end || now <= end);
            case 'À venir':
              return start && now < start;
            case 'Terminé':
              return end && now > end;
            default:
              return true;
          }
        });
      }
      
      // Tri des résultats
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.createdAt || b.dateCreation || 0) - new Date(a.createdAt || a.dateCreation || 0);
          case 'popular':
            return (b.participantsCount || 0) - (a.participantsCount || 0);
          case 'alphabetical':
            return (a.title || '').localeCompare(b.title || '');
          default:
            return 0;
        }
      });
      
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

  // Fonctions pour la gestion des utilisateurs
  const loadUsers = async () => {
    try {
      setUserLoading(true);
      console.log('🔄 Chargement des utilisateurs...');
      
      const response = await userService.getUsers();
      
      if (response.success) {
        const usersData = response.users || [];
        console.log('👥 Utilisateurs reçus:', usersData);
        
        // Transformer les données si nécessaire
        const transformedUsers = Array.isArray(usersData) ? usersData.map(user => ({
          id: user._id || user.id,
          nom: user.nom || user.name || user.fullName,
          email: user.email,
          role: user.role || 'collaborateur',
          statut: user.statut || user.status || 'Actif',
          dateInscription: user.dateInscription || user.createdAt || new Date().toISOString(),
          defisCompletes: user.defisCompletes || user.completedChallenges || 0,
          points: user.points || 0
        })) : [];
        
        setUtilisateurs(transformedUsers);
        setFilteredUtilisateurs(transformedUsers);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des utilisateurs');
      }
      
    } catch (error) {
      console.warn('⚠️ API utilisateurs non disponible, données factices utilisées');
      // Utiliser des données factices si l'API n'est pas disponible
      const mockUsers = [
        {
          id: '1',
          nom: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'admin',
          statut: 'Actif',
          dateInscription: '2024-01-15T10:00:00Z',
          defisCompletes: 15,
          points: 1250
        },
        {
          id: '2',
          nom: 'Marie Martin',
          email: 'marie.martin@example.com',
          role: 'collaborateur',
          statut: 'Actif',
          dateInscription: '2024-02-20T14:30:00Z',
          defisCompletes: 8,
          points: 680
        },
        {
          id: '3',
          nom: 'Pierre Bernard',
          email: 'pierre.bernard@example.com',
          role: 'collaborateur',
          statut: 'Inactif',
          dateInscription: '2024-01-05T09:15:00Z',
          defisCompletes: 3,
          points: 240
        },
        {
          id: '4',
          nom: 'Sophie Leroy',
          email: 'sophie.leroy@example.com',
          role: 'collaborateur',
          statut: 'Actif',
          dateInscription: '2024-03-10T16:45:00Z',
          defisCompletes: 12,
          points: 980
        }
      ];
      
      setUtilisateurs(mockUsers);
      setFilteredUtilisateurs(mockUsers);
    } finally {
      setUserLoading(false);
    }
  };

  // Fonction de filtrage des utilisateurs
  const applyUserFilters = () => {
    if (!utilisateurs || utilisateurs.length === 0) {
      setFilteredUtilisateurs([]);
      return;
    }
    
    let filtered = [...utilisateurs];
    
    // Filtrage par recherche (nom et email)
    if (userSearchTerm.trim()) {
      const searchLower = userSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.nom?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtrage par rôle
    if (userRoleFilter) {
      filtered = filtered.filter(user => {
        if (userRoleFilter === 'Admin') return user.role === 'admin';
        if (userRoleFilter === 'Collaborateur') return user.role === 'collaborateur';
        return true;
      });
    }
    
    // Filtrage par statut
    if (userStatusFilter) {
      filtered = filtered.filter(user => user.statut === userStatusFilter);
    }
    
    setFilteredUtilisateurs(filtered);
  };

  // Fonction pour voir les détails d'un utilisateur
  const handleViewUser = (user) => {
    if (!user) {
      console.error('❌ Utilisateur non défini pour handleViewUser');
      return;
    }
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  // Fonction pour éditer un utilisateur
  const handleEditUser = (user) => {
    if (!user) {
      console.error('❌ Utilisateur non défini pour handleEditUser');
      return;
    }
    setSelectedUser(user);
    setUserEditForm({
      nom: user.nom || '',
      email: user.email || '',
      role: user.role || 'collaborateur',
      statut: user.statut || 'Actif'
    });
    setShowEditUserModal(true);
  };

  // Fonction pour ouvrir les paramètres utilisateur
  const handleUserSettings = (user) => {
    if (!user) {
      console.error('❌ Utilisateur non défini pour handleUserSettings');
      return;
    }
    setSelectedUser(user);
    setShowUserSettingsModal(true);
  };

  // Fonction pour sauvegarder les modifications d'un utilisateur
  const handleSaveUserEdit = async () => {
    try {
      setUserActionLoading(true);
      
      const response = await userService.updateUser(selectedUser.id, userEditForm);
      
      if (response.success) {
        console.log('✅ Utilisateur modifié:', response.user);
        await loadUsers(); // Recharger la liste
        setShowEditUserModal(false);
        alert(response.message || 'Utilisateur modifié avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la modification');
      }
    } catch (error) {
      console.error('❌ Erreur modification utilisateur:', error);
      alert(`Erreur lors de la modification: ${error.message}`);
    } finally {
      setUserActionLoading(false);
    }
  };

  // Fonction pour changer le rôle d'un utilisateur
  const handleChangeUserRole = async (userId, newRole) => {
    try {
      setUserActionLoading(true);
      
      const response = await userService.changeUserRole(userId, newRole);
      
      if (response.success) {
        console.log('✅ Rôle modifié');
        await loadUsers(); // Recharger la liste
        alert(response.message || 'Rôle modifié avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors du changement de rôle');
      }
    } catch (error) {
      console.error('❌ Erreur changement rôle:', error);
      alert(`Erreur lors du changement de rôle: ${error.message}`);
    } finally {
      setUserActionLoading(false);
    }
  };

  // Fonction pour changer le statut d'un utilisateur
  const handleChangeUserStatus = async (userId, newStatus) => {
    try {
      setUserActionLoading(true);
      
      const response = await userService.changeUserStatus(userId, newStatus);
      
      if (response.success) {
        console.log('✅ Statut modifié');
        await loadUsers(); // Recharger la liste
        alert(response.message || 'Statut modifié avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('❌ Erreur changement statut:', error);
      alert(`Erreur lors du changement de statut: ${error.message}`);
    } finally {
      setUserActionLoading(false);
    }
  };

  // Fonction pour inviter un utilisateur
  const handleInviteUser = async () => {
    try {
      if (!inviteForm.email.trim() || !inviteForm.nom.trim()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      setUserActionLoading(true);
      
      const response = await userService.inviteUser(inviteForm);
      
      if (response.success) {
        console.log('✅ Invitation envoyée:', response.invitation);
        setShowInviteUserModal(false);
        setInviteForm({ email: '', nom: '', role: 'collaborateur' });
        alert(response.message || 'Invitation envoyée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de l\'invitation');
      }
    } catch (error) {
      console.error('❌ Erreur invitation:', error);
      alert(`Erreur lors de l'invitation: ${error.message}`);
    } finally {
      setUserActionLoading(false);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      setUserActionLoading(true);
      
      const response = await userService.deleteUser(userId);
      
      if (response.success) {
        console.log('✅ Utilisateur supprimé');
        await loadUsers(); // Recharger la liste
        alert(response.message || 'Utilisateur supprimé avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ Erreur suppression utilisateur:', error);
      alert(`Erreur lors de la suppression: ${error.message}`);
    } finally {
      setUserActionLoading(false);
    }
  };

  // Fonctions pour la gestion des récompenses
  const loadRewards = async () => {
    try {
      setRecompenseLoading(true);
      console.log('🔄 Chargement des récompenses...');
      
      // Utiliser le service dédié
      const response = await rewardService.getRewards();
      
      if (response.success) {
        const rewardsData = response.rewards || [];
        console.log('🎁 Récompenses reçues:', rewardsData);
        
        // Transformer les données si nécessaire
        const transformedRewards = Array.isArray(rewardsData) ? rewardsData.map(reward => ({
          id: reward._id || reward.id,
          name: reward.name || reward.title,
          description: reward.description || '',
          points: reward.points || 0,
          category: reward.category || 'Général',
          image: reward.image || '',
          rarity: reward.rarity || 'common',
          status: reward.status || 'active',
          createdAt: reward.createdAt,
          obtentions: reward.obtentions || 0
        })) : [];
        
        setRecompenses(transformedRewards);
        setFilteredRecompenses(transformedRewards);
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des récompenses');
      }
      
    } catch (error) {
      console.warn('⚠️ API récompenses non disponible, données factices utilisées');
      // Utiliser des données factices si l'API n'est pas disponible
      const mockRewards = [
        {
          id: '1',
          name: 'Champion du mois',
          description: 'Récompense pour avoir complété le plus de défis ce mois-ci',
          points: 500,
          category: 'Achievement',
          image: '🏆',
          rarity: 'legendary',
          status: 'active',
          createdAt: new Date().toISOString(),
          obtentions: 12
        },
        {
          id: '2',
          name: 'Éco-warrior',
          description: 'Récompense pour la participation à 5 défis écologiques',
          points: 250,
          category: 'Écologique',
          image: '🌱',
          rarity: 'rare',
          status: 'active',
          createdAt: new Date().toISOString(),
          obtentions: 28
        },
        {
          id: '3',
          name: 'Collaborateur du mois',
          description: 'Reconnaissance pour l\'excellent travail d\'équipe',
          points: 300,
          category: 'Teamwork',
          image: '🤝',
          rarity: 'epic',
          status: 'active',
          createdAt: new Date().toISOString(),
          obtentions: 8
        }
      ];
      
      setRecompenses(mockRewards);
      setFilteredRecompenses(mockRewards);
    } finally {
      setRecompenseLoading(false);
    }
  };

  // Fonction pour charger les statistiques des récompenses
  const loadRewardStats = async () => {
    try {
      // Essayer d'abord de récupérer les stats via l'API
      const response = await rewardService.getRewardStats();
      
      if (response.success && response.stats) {
        setRewardStats({
          actives: response.stats.actives || 0,
          obtenues: response.stats.obtenues || 0,
          pointsDistribues: response.stats.pointsDistribues || 0
        });
      } else {
        // Calculer les statistiques à partir des données locales
        const activeRewards = recompenses.filter(r => r.status === 'active').length;
        const totalObtentions = recompenses.reduce((sum, r) => sum + (r.obtentions || 0), 0);
        const totalPoints = recompenses.reduce((sum, r) => sum + ((r.obtentions || 0) * (r.points || 0)), 0);
        
        setRewardStats({
          actives: activeRewards,
          obtenues: totalObtentions,
          pointsDistribues: totalPoints
        });
      }
    } catch (error) {
      console.error('❌ Erreur chargement statistiques récompenses:', error);
      // Fallback sur le calcul local
      const activeRewards = recompenses.filter(r => r.status === 'active').length;
      const totalObtentions = recompenses.reduce((sum, r) => sum + (r.obtentions || 0), 0);
      const totalPoints = recompenses.reduce((sum, r) => sum + ((r.obtentions || 0) * (r.points || 0)), 0);
      
      setRewardStats({
        actives: activeRewards,
        obtenues: totalObtentions,
        pointsDistribues: totalPoints
      });
    }
  };

  // Fonction de filtrage des récompenses
  const applyRewardFilters = () => {
    let filtered = [...recompenses];
    
    // Filtrage par recherche
    if (recompenseSearchTerm.trim()) {
      const searchLower = recompenseSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(reward => 
        reward.name?.toLowerCase().includes(searchLower) ||
        reward.description?.toLowerCase().includes(searchLower) ||
        reward.category?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredRecompenses(filtered);
  };

  // Fonction pour créer une nouvelle récompense
  const handleCreateReward = async () => {
    try {
      if (!rewardForm.name.trim() || !rewardForm.points) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const newReward = {
        name: rewardForm.name,
        description: rewardForm.description,
        points: parseInt(rewardForm.points),
        category: rewardForm.category || 'Général',
        image: rewardForm.image || '🎁',
        rarity: rewardForm.rarity,
        status: rewardForm.status
      };

      // Utiliser le service dédié
      const response = await rewardService.createReward(newReward);
      
      if (response.success) {
        console.log('✅ Récompense créée:', response.reward);
        await loadRewards(); // Recharger la liste
        alert(response.message || 'Récompense créée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la création');
      }

      // Réinitialiser le formulaire et fermer le modal
      setRewardForm({
        name: '',
        description: '',
        points: '',
        category: '',
        image: '',
        rarity: 'common',
        status: 'active'
      });
      setShowCreateRewardModal(false);
      
      console.log('✅ Récompense créée avec succès');
      
    } catch (error) {
      console.error('❌ Erreur création récompense:', error);
      alert('Erreur lors de la création de la récompense');
    }
  };

  // Fonction pour supprimer une récompense
  const handleDeleteReward = async (rewardId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette récompense ?')) {
      return;
    }
    
    try {
      // Utiliser le service dédié
      const response = await rewardService.deleteReward(rewardId);
      
      if (response.success) {
        console.log('✅ Récompense supprimée');
        await loadRewards(); // Recharger la liste
        alert(response.message || 'Récompense supprimée avec succès');
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ Erreur suppression récompense:', error);
      alert(`Erreur lors de la suppression: ${error.message}`);
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
        loadStats(),
        loadUsers(),
        loadGroups(),
        loadRewards()
      ]);
      setLoading(false);
    };
    
    initializeData();
  }, [navigate]);

  // Charger les preuves quand on change d'onglet
  useEffect(() => {
    if (activeTab === 'validation') {
      loadPendingProofs();
    } else if (activeTab === 'recompenses') {
      loadRewards();
    }
  }, [activeTab]);

  // Appliquer les filtres quand les données ou filtres changent
  useEffect(() => {
    applyFilters();
  }, [defis, searchTerm, categoryFilter, statusFilter, sortBy]);

  // Appliquer les filtres des récompenses
  useEffect(() => {
    applyRewardFilters();
  }, [recompenses, recompenseSearchTerm]);

  // Appliquer les filtres des utilisateurs
  useEffect(() => {
    applyUserFilters();
  }, [utilisateurs, userSearchTerm, userRoleFilter, userStatusFilter]);

  // Mettre à jour les statistiques des récompenses
  useEffect(() => {
    if (recompenses.length > 0) {
      loadRewardStats();
    }
  }, [recompenses]);

  // Raccourci clavier pour la recherche
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K pour focus la recherche
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Rechercher"]');
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape pour vider la recherche
      if (e.key === 'Escape' && searchTerm) {
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchTerm]);




  // Fonction pour charger les groupes
  const loadGroups = async () => {
    try {
      setGroupLoading(true);
      console.log('🔄 Chargement des groupes...');
      const response = await api.get('/groups');
      const groupsData = response.data || response;
      
      console.log('👥 Groupes reçus:', groupsData);
      
      // Transformer les données pour correspondre au format attendu par l'interface
      const transformedGroups = groupsData.map(group => ({
        id: group.id || group._id,
        name: group.name,
        description: group.description,
        challenge: group.challenge,
        members: group.members || [],
        createdAt: group.createdAt,
        status: group.status || 'actif',
        stats: group.stats || {
          totalMembers: group.members?.length || 0,
          totalPoints: 0,
          activeParticipants: 0,
          averageScore: 0
        }
      }));
      
      setGroupes(transformedGroups);
      setFilteredGroupes(transformedGroups);
      console.log('✅ Groupes chargés:', transformedGroups.length);
      
    } catch (error) {
      console.error('❌ Erreur chargement groupes:', error);
      setGroupes([]);
      setFilteredGroupes([]);
    } finally {
      setGroupLoading(false);
    }
  };

  // Fonction de filtrage des groupes
  const filterGroups = () => {
    let filtered = [...groupes];
    
    // Filtrage par terme de recherche
    if (groupSearchTerm.trim()) {
      const term = groupSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(term) ||
        group.description?.toLowerCase().includes(term) ||
        group.challenge?.title?.toLowerCase().includes(term)
      );
    }
    
    // Filtrage par défi/challenge
    if (groupChallengeFilter && groupChallengeFilter !== 'Tous les défis') {
      filtered = filtered.filter(group => 
        group.challenge?.title === groupChallengeFilter
      );
    }
    
    // Tri par date (plus récent en premier)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredGroupes(filtered);
  };

  // Effect pour le filtrage des groupes
  useEffect(() => {
    filterGroups();
  }, [groupSearchTerm, groupChallengeFilter, groupes]);

  // Fonctions de gestion des actions groupes
  const handleViewGroupDetails = async (group) => {
    try {
      setGroupActionLoading(true);
      console.log('📖 Chargement détails groupe:', group.name);
      
      // Récupérer les détails complets du groupe
      const response = await api.get(`/groups/${group.id}`);
      const groupDetails = response.data || response;
      
      setSelectedGroup({
        ...group,
        ...groupDetails,
        detailsLoaded: true
      });
      setShowGroupDetailsModal(true);
      
    } catch (error) {
      console.error('❌ Erreur chargement détails groupe:', error);
      alert('Erreur lors du chargement des détails du groupe');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setEditForm({
      name: group.name || '',
      description: group.description || '',
      status: group.status || 'actif'
    });
    setShowEditGroupModal(true);
  };

  const handleManageMembers = async (group) => {
    try {
      setGroupActionLoading(true);
      setSelectedGroup(group);
      
      // Charger les utilisateurs disponibles (qui ne sont pas encore dans le groupe)
      console.log('🔍 Debugging utilisateurs disponibles...');
      console.log('Utilisateurs bruts:', utilisateurs.slice(0, 2)); // Afficher 2 premiers pour debug
      
      const currentMemberIds = group.members?.map(m => m._id || m.id) || [];
      console.log('IDs membres actuels:', currentMemberIds);
      
      const filteredUsers = utilisateurs.filter(user => {
        const userId = user.id; // Les utilisateurs ont été transformés avec 'id'
        return !currentMemberIds.includes(userId);
      });
      
      console.log('Utilisateurs filtrés:', filteredUsers.length);
      console.log('Premier utilisateur filtré:', filteredUsers[0]);
      
      setAvailableUsers(filteredUsers);
      setSelectedUsersToAdd([]);
      setMemberSearchTerm('');
      setShowManageMembersModal(true);
      
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
    } finally {
      setGroupActionLoading(false);
    }
  };

  const handleDeleteGroup = (group) => {
    setSelectedGroup(group);
    setShowDeleteGroupModal(true);
  };

  const confirmDeleteGroup = async () => {
    if (!selectedGroup) return;
    
    try {
      setGroupActionLoading(true);
      console.log('🗑️ Suppression groupe:', selectedGroup.name);
      
      // Appel API pour supprimer le groupe
      await api.delete(`/groups/${selectedGroup.id}`);
      
      // Mettre à jour la liste locale
      const updatedGroups = groupes.filter(g => g.id !== selectedGroup.id);
      setGroupes(updatedGroups);
      setFilteredGroupes(updatedGroups);
      
      setShowDeleteGroupModal(false);
      setSelectedGroup(null);
      
      console.log('✅ Groupe supprimé avec succès');
      alert('Groupe supprimé avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur suppression groupe:', error);
      alert('Erreur lors de la suppression du groupe');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const saveGroupChanges = async () => {
    if (!selectedGroup || !editForm.name.trim()) {
      alert('Le nom du groupe est requis');
      return;
    }
    
    try {
      setGroupActionLoading(true);
      console.log('💾 Sauvegarde modifications groupe:', selectedGroup.name);
      
      const updateData = {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        status: editForm.status
      };
      
      // Appel API pour mettre à jour le groupe
      const response = await api.put(`/groups/${selectedGroup.id}`, updateData);
      const updatedGroup = response.data || response;
      
      // Mettre à jour la liste locale
      const updatedGroups = groupes.map(g => 
        g.id === selectedGroup.id 
          ? { ...g, ...updateData }
          : g
      );
      setGroupes(updatedGroups);
      setFilteredGroupes(updatedGroups);
      
      console.log('✅ Groupe modifié avec succès');
      alert('Groupe modifié avec succès !');
      closeGroupModals();
      
    } catch (error) {
      console.error('❌ Erreur modification groupe:', error);
      alert('Erreur lors de la modification du groupe');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const addMembersToGroup = async () => {
    if (!selectedGroup || selectedUsersToAdd.length === 0) {
      alert('Veuillez sélectionner au moins un membre à ajouter');
      return;
    }
    
    try {
      setGroupActionLoading(true);
      console.log(`👥 Ajout de ${selectedUsersToAdd.length} membres au groupe:`, selectedGroup.name);
      console.log('IDs sélectionnés:', selectedUsersToAdd);
      console.log('ID du groupe:', selectedGroup.id);
      
      // Ajouter chaque membre sélectionné
      for (const userId of selectedUsersToAdd) {
        console.log('Ajout membre avec ID:', userId);
        try {
          const response = await api.post(`/groups/${selectedGroup.id}/members`, { userId });
          console.log('Réponse pour', userId, ':', response.data);
        } catch (memberError) {
          console.error('Erreur pour membre', userId, ':', memberError.response?.data || memberError.message);
          throw memberError; // Relancer l'erreur pour arrêter la boucle
        }
      }
      
      // Recharger les groupes pour avoir les données à jour
      await loadGroups();
      
      console.log('✅ Membres ajoutés avec succès');
      alert(`${selectedUsersToAdd.length} membre(s) ajouté(s) avec succès !`);
      closeGroupModals();
      
    } catch (error) {
      console.error('❌ Erreur ajout membres:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Erreur inconnue';
      alert(`Erreur lors de l'ajout des membres: ${errorMsg}`);
    } finally {
      setGroupActionLoading(false);
    }
  };

  const removeMemberFromGroup = async (memberId) => {
    if (!selectedGroup || !memberId) return;
    
    try {
      setGroupActionLoading(true);
      console.log('🗑️ Suppression membre du groupe:', memberId);
      
      await api.delete(`/groups/${selectedGroup.id}/members/${memberId}`);
      
      // Recharger les groupes pour avoir les données à jour
      await loadGroups();
      
      console.log('✅ Membre supprimé avec succès');
      alert('Membre supprimé du groupe avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur suppression membre:', error);
      alert('Erreur lors de la suppression du membre');
    } finally {
      setGroupActionLoading(false);
    }
  };

  const closeGroupModals = () => {
    setShowGroupDetailsModal(false);
    setShowEditGroupModal(false);
    setShowManageMembersModal(false);
    setShowDeleteGroupModal(false);
    setShowCreateGroupModal(false);
    setSelectedGroup(null);
    setEditForm({ name: '', description: '', status: 'actif' });
    setCreateGroupForm({ name: '', description: '', challengeId: '' });
    setSelectedUsersToAdd([]);
    setMemberSearchTerm('');
  };

  // Fonction pour créer un nouveau groupe
  const createNewGroup = async () => {
    if (!createGroupForm.name.trim()) {
      alert('Le nom du groupe est requis');
      return;
    }
    if (!createGroupForm.challengeId) {
      alert('Veuillez sélectionner un défi');
      return;
    }
    
    try {
      setGroupActionLoading(true);
      console.log('📝 Création du groupe:', createGroupForm);
      
      const response = await api.post('/groups', {
        name: createGroupForm.name.trim(),
        description: createGroupForm.description.trim(),
        challengeId: createGroupForm.challengeId
      });
      
      console.log('✅ Groupe créé avec succès:', response.data);
      alert('Groupe créé avec succès !');
      
      // Recharger les groupes
      await loadGroups();
      closeGroupModals();
      
    } catch (error) {
      console.error('❌ Erreur création groupe:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Erreur inconnue';
      alert(`Erreur lors de la création du groupe: ${errorMsg}`);
    } finally {
      setGroupActionLoading(false);
    }
  };

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
              { id: 'groupes', label: 'Groupes', icon: UserCheck },
              { id: 'recompenses', label: 'Récompenses', icon: Gift }
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <button 
                  onClick={() => setActiveTab('groupes')}
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                >
                  <Target className="text-purple-600 w-5 h-5" />
                  <span className="font-medium text-purple-800">Gérer les groupes</span>
                </button>
                <button 
                  onClick={() => setActiveTab('recompenses')}
                  className="flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
                >
                  <Gift className="text-yellow-600 w-5 h-5" />
                  <span className="font-medium text-yellow-800">Gérer les récompenses</span>
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
              {/* Badges des filtres actifs */}
              {(searchTerm || categoryFilter !== 'Toutes les catégories' || statusFilter !== 'Tous les statuts') && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 mr-2">Filtres actifs :</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      Recherche: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {categoryFilter !== 'Toutes les catégories' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {categoryFilter}
                      <button onClick={() => setCategoryFilter('Toutes les catégories')} className="hover:text-green-900">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {statusFilter !== 'Tous les statuts' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {statusFilter}
                      <button onClick={() => setStatusFilter('Tous les statuts')} className="hover:text-purple-900">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      searchTerm ? 'text-blue-500' : 'text-gray-400'
                    }`} />
                    <input
                      type="text"
                      placeholder="Rechercher un défi par titre ou description... (Ctrl+K)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Toutes les catégories">Toutes les catégories</option>
                  <option value="Solidaire">Solidaire</option>
                  <option value="Écologique">Écologique</option>
                  <option value="Créatif">Créatif</option>
                  <option value="Sportif">Sportif</option>
                  <option value="Éducatif">Éducatif</option>
                  <option value="Bien-être">Bien-être</option>
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
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {filteredDefis.length} défi{filteredDefis.length > 1 ? 's' : ''} affiché{filteredDefis.length > 1 ? 's' : ''}
                  {searchTerm && ` pour "${searchTerm}"`}
                  {(categoryFilter !== 'Toutes les catégories' || statusFilter !== 'Tous les statuts') && 
                    ` (${defis.length} au total)`
                  }
                </div>
                
                <div className="flex gap-2">
                  {/* Bouton reset filtres - affiché seulement si des filtres sont actifs */}
                  {(searchTerm || categoryFilter !== 'Toutes les catégories' || statusFilter !== 'Tous les statuts') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setCategoryFilter('Toutes les catégories');
                        setStatusFilter('Tous les statuts');
                        setSortBy('recent');
                      }}
                      className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 rounded text-blue-600 transition-colors"
                    >
                      Effacer les filtres
                    </button>
                  )}
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
                          <div className="flex flex-col items-center justify-center">
                            <div className="text-lg mb-2">
                              {defis.length === 0 ? 'Aucun défi trouvé' : 'Aucun défi ne correspond aux filtres appliqués'}
                            </div>
                            {defis.length > 0 && (
                              <div className="text-sm text-gray-400">
                                Essayez de modifier vos critères de recherche ou de filtrage.
                              </div>
                            )}
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
              <button 
                onClick={() => setShowInviteUserModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
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
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les rôles</option>
                  <option value="Admin">Admin</option>
                  <option value="Collaborateur">Collaborateur</option>
                </select>
                <select 
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                  <option value="Suspendu">Suspendu</option>
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
                    {userLoading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          Chargement des utilisateurs...
                        </td>
                      </tr>
                    ) : filteredUtilisateurs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredUtilisateurs.map((utilisateur) => (
                      <tr key={utilisateur.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {utilisateur.nom ? utilisateur.nom.split(' ').map(n => n[0]).join('').toUpperCase() : '??'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{utilisateur.nom || 'Utilisateur'}</div>
                              <div className="text-sm text-gray-500">Inscrit le {utilisateur.dateInscription ? new Date(utilisateur.dateInscription).toLocaleDateString('fr-FR') : 'Date inconnue'}</div>
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
                            <button 
                              onClick={() => handleViewUser(utilisateur)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir les détails"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditUser(utilisateur)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Modifier l'utilisateur"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleUserSettings(utilisateur)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="Paramètres avancés"
                            >
                              <Settings size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
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
              <button 
                onClick={() => setShowCreateGroupModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
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
                <p className="text-3xl font-bold text-gray-800">{groupes.filter(g => g.status === 'actif').length}</p>
                <p className="text-sm text-green-600">{groupes.length} total</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="text-blue-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Membres Total</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {groupes.reduce((total, group) => total + (group.stats?.totalMembers || 0), 0)}
                </p>
                <p className="text-sm text-blue-600">Dans tous les groupes</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-green-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Score Moyen</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {groupes.length > 0 ? 
                    Math.round(groupes.reduce((total, group) => total + (group.stats?.averageScore || 0), 0) / groupes.length) 
                    : 0}
                </p>
                <p className="text-sm text-green-600">Points par groupe</p>
              </div>
            </div>

            {/* Filtres groupes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un groupe..."
                      value={groupSearchTerm}
                      onChange={(e) => setGroupSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select 
                  value={groupChallengeFilter}
                  onChange={(e) => setGroupChallengeFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Tous les défis</option>
                  {[...new Set(groupes.map(g => g.challenge?.title).filter(Boolean))].map(title => (
                    <option key={title} value={title}>{title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Liste des groupes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Liste des groupes ({filteredGroupes.length})
                </h3>
              </div>

              {groupLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des groupes...</p>
                </div>
              ) : filteredGroupes.length === 0 ? (
                <div className="p-6">
                  <div className="text-center py-12">
                    <UserCheck className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {groupes.length === 0 ? "Aucun groupe pour le moment" : "Aucun groupe trouvé"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {groupes.length === 0 
                        ? "Créez votre premier groupe pour commencer à organiser vos collaborateurs"
                        : "Essayez de modifier vos critères de recherche"
                      }
                    </p>
                    {groupes.length === 0 && (
                      <button className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                        Créer le premier groupe
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Groupe</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Défi</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Membres</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Score Total</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Statut</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredGroupes.map((groupe) => (
                        <tr key={groupe.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                                {groupe.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{groupe.name}</div>
                                <div className="text-sm text-gray-500">
                                  {groupe.description ? 
                                    (groupe.description.length > 50 ? 
                                      groupe.description.substring(0, 50) + "..." : 
                                      groupe.description
                                    ) : 
                                    "Pas de description"
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {groupe.challenge ? (
                              <div>
                                <div className="font-medium text-gray-800">{groupe.challenge.title}</div>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {groupe.challenge.category}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">Aucun défi</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Users className="text-blue-500 w-4 h-4" />
                              <span className="font-medium text-gray-800">{groupe.stats?.totalMembers || 0}</span>
                              <span className="text-sm text-gray-500">membres</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Award className="text-yellow-500 w-4 h-4" />
                              <span className="font-medium text-gray-800">{groupe.stats?.totalPoints || 0}</span>
                              <span className="text-sm text-gray-500">pts</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                              groupe.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {groupe.status === 'actif' ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleViewGroupDetails(groupe)}
                                disabled={groupActionLoading}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50" 
                                title="Voir détails"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditGroup(groupe)}
                                disabled={groupActionLoading}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50" 
                                title="Modifier"
                              >
                                <Edit3 size={16} />
                              </button>
                              <button 
                                onClick={() => handleManageMembers(groupe)}
                                disabled={groupActionLoading}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50" 
                                title="Gérer membres"
                              >
                                <Settings size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteGroup(groupe)}
                                disabled={groupActionLoading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50" 
                                title="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modales pour les actions des groupes */}
        
        {/* Modal Détails du groupe */}
        {showGroupDetailsModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Détails du groupe</h3>
                  <button 
                    onClick={closeGroupModals}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Informations de base */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Informations générales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nom du groupe</label>
                      <p className="text-gray-800 font-medium">{selectedGroup.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        selectedGroup.status === 'actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedGroup.status === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-800">{selectedGroup.description || "Aucune description"}</p>
                    </div>
                  </div>
                </div>

                {/* Défi associé */}
                {selectedGroup.challenge && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Défi associé</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Titre</label>
                        <p className="text-gray-800 font-medium">{selectedGroup.challenge.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Catégorie</label>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {selectedGroup.challenge.category}
                        </span>
                      </div>
                      {selectedGroup.challenge.description && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Description du défi</label>
                          <p className="text-gray-800 text-sm">{selectedGroup.challenge.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="bg-purple-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Statistiques</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedGroup.stats?.totalMembers || 0}</div>
                      <div className="text-sm text-gray-600">Membres</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedGroup.stats?.activeParticipants || 0}</div>
                      <div className="text-sm text-gray-600">Actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{selectedGroup.stats?.totalPoints || 0}</div>
                      <div className="text-sm text-gray-600">Points total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedGroup.stats?.averageScore || 0}</div>
                      <div className="text-sm text-gray-600">Score moyen</div>
                    </div>
                  </div>
                </div>

                {/* Membres du groupe */}
                {selectedGroup.members && selectedGroup.members.length > 0 && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Membres du groupe</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedGroup.members.map((member, index) => (
                        <div key={member._id || index} className="flex items-center gap-3 p-2 bg-white rounded-lg">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {(member.firstName || member.username || member.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {member.firstName && member.lastName 
                                ? `${member.firstName} ${member.lastName}`
                                : member.username || member.email
                              }
                            </div>
                            <div className="text-sm text-gray-500">{member.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={closeGroupModals}
                    className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={() => {
                      closeGroupModals();
                      handleEditGroup(selectedGroup);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Supprimer groupe */}
        {showDeleteGroupModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="text-red-600 w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Supprimer le groupe</h3>
                    <p className="text-gray-600">Cette action est irréversible</p>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-800 text-sm">
                    Êtes-vous sûr de vouloir supprimer le groupe <strong>"{selectedGroup.name}"</strong> ?
                  </p>
                  <p className="text-red-600 text-xs mt-2">
                    • {selectedGroup.stats?.totalMembers || 0} membres seront affectés<br/>
                    • Toutes les données du groupe seront perdues
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={closeGroupModals}
                    disabled={groupActionLoading}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmDeleteGroup}
                    disabled={groupActionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                  >
                    {groupActionLoading ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Modifier groupe */}
        {showEditGroupModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">Modifier le groupe</h3>
                  <button 
                    onClick={closeGroupModals}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Nom du groupe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du groupe *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Nom du groupe"
                    disabled={groupActionLoading}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Description du groupe (optionnel)"
                    disabled={groupActionLoading}
                  />
                </div>

                {/* Statut */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={groupActionLoading}
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>

                {/* Informations actuelles */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Informations actuelles</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Défi: {selectedGroup.challenge?.title || 'Aucun'}</div>
                    <div>Membres: {selectedGroup.stats?.totalMembers || 0}</div>
                    <div>Créé le: {new Date(selectedGroup.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button 
                    onClick={closeGroupModals}
                    disabled={groupActionLoading}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={saveGroupChanges}
                    disabled={groupActionLoading || !editForm.name.trim()}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                  >
                    {groupActionLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Gérer membres */}
        {showManageMembersModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-800">
                    Gérer les membres - {selectedGroup.name}
                  </h3>
                  <button 
                    onClick={closeGroupModals}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Membres actuels */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Membres actuels ({selectedGroup.members?.length || 0})
                    </h4>
                    
                    {selectedGroup.members && selectedGroup.members.length > 0 ? (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedGroup.members.map((member) => (
                          <div key={member._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {(member.firstName || member.username || member.email).charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {member.firstName && member.lastName 
                                    ? `${member.firstName} ${member.lastName}`
                                    : member.username || member.email
                                  }
                                </div>
                                <div className="text-sm text-gray-500">{member.email}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeMemberFromGroup(member._id)}
                              disabled={groupActionLoading}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Retirer du groupe"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                        <p>Aucun membre dans ce groupe</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Ajouter de nouveaux membres */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Ajouter des membres
                    </h4>
                    
                    {/* Recherche d'utilisateurs */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Rechercher un utilisateur..."
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* Liste des utilisateurs disponibles */}
                    <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                      {availableUsers
                        .filter(user => {
                          if (!memberSearchTerm.trim()) return true;
                          const term = memberSearchTerm.toLowerCase();
                          return (
                            user.email.toLowerCase().includes(term) ||
                            user.nom.toLowerCase().includes(term)
                          );
                        })
                        .map((user) => {
                          const userId = user.id; // Les utilisateurs transformés utilisent 'id'
                          return (
                            <div key={userId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                  {(user.nom || user.email).charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">
                                    {user.nom || user.email}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-xs text-gray-400">ID: {userId}</div>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedUsersToAdd.includes(userId)}
                                onChange={(e) => {
                                  console.log('🔄 Checkbox change:', { userId, checked: e.target.checked, userObject: user });
                                  if (e.target.checked) {
                                    setSelectedUsersToAdd([...selectedUsersToAdd, userId]);
                                  } else {
                                    setSelectedUsersToAdd(selectedUsersToAdd.filter(id => id !== userId));
                                  }
                                }}
                                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                              />
                            </div>
                          );
                        })
                      }
                      
                      {availableUsers.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <UserCheck className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                          <p>Tous les utilisateurs sont déjà membres</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Bouton d'ajout */}
                    {selectedUsersToAdd.length > 0 && (
                      <button
                        onClick={addMembersToGroup}
                        disabled={groupActionLoading}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                      >
                        {groupActionLoading 
                          ? 'Ajout en cours...' 
                          : `Ajouter ${selectedUsersToAdd.length} membre(s)`
                        }
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={closeGroupModals}
                  disabled={groupActionLoading}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onglet Récompenses */}
        {activeTab === 'recompenses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Gestion des Récompenses</h2>
              <button 
                onClick={() => setShowCreateRewardModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus size={18} />
                Créer une récompense
              </button>
            </div>

            {/* Statistiques des récompenses */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Gift className="text-yellow-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Récompenses Actives</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{rewardStats.actives}</p>
                <p className="text-sm text-green-600">disponibles</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Award className="text-green-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Récompenses Obtenues</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{rewardStats.obtenues}</p>
                <p className="text-sm text-blue-600">total</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-purple-600 w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-gray-800">Points Distribués</h3>
                </div>
                <p className="text-3xl font-bold text-gray-800">{rewardStats.pointsDistribues.toLocaleString()}</p>
                <p className="text-sm text-purple-600">total</p>
              </div>
            </div>

            {/* Liste des récompenses */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Liste des Récompenses ({filteredRecompenses.length})
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Rechercher une récompense..."
                        value={recompenseSearchTerm}
                        onChange={(e) => setRecompenseSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {recompenseLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Chargement des récompenses...</p>
                  </div>
                ) : filteredRecompenses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Gift className="mx-auto w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {recompenseSearchTerm ? 'Aucune récompense trouvée' : 'Aucune récompense'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {recompenseSearchTerm ? 'Essayez de modifier vos critères de recherche' : 'Commencez par créer votre première récompense'}
                    </p>
                    {!recompenseSearchTerm && (
                      <button 
                        onClick={() => setShowCreateRewardModal(true)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        Créer une récompense
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRecompenses.map((reward) => (
                      <div key={reward.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{reward.image || '🎁'}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg font-semibold text-gray-800">{reward.name}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  reward.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                                  reward.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                                  reward.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {reward.rarity}
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  reward.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {reward.status === 'active' ? 'Actif' : 'Inactif'}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">{reward.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Award className="w-4 h-4" />
                                  {reward.points} points
                                </span>
                                <span className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {reward.category}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {reward.obtentions || 0} obtenues
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDeleteReward(reward.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal de création de groupe */}
      {showCreateGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Créer un nouveau groupe</h2>
                <button
                  onClick={closeGroupModals}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du groupe
                </label>
                <input
                  type="text"
                  value={createGroupForm.name}
                  onChange={(e) => setCreateGroupForm({...createGroupForm, name: e.target.value})}
                  placeholder="Ex: Équipe Alpha"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={createGroupForm.description}
                  onChange={(e) => setCreateGroupForm({...createGroupForm, description: e.target.value})}
                  placeholder="Description du groupe..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Défi associé
                </label>
                <select
                  value={createGroupForm.challengeId}
                  onChange={(e) => setCreateGroupForm({...createGroupForm, challengeId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un défi</option>
                  {defis.map((defi) => (
                    <option key={defi._id} value={defi._id}>
                      {defi.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={closeGroupModals}
                disabled={groupActionLoading}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={createNewGroup}
                disabled={groupActionLoading}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
              >
                {groupActionLoading ? 'Création...' : 'Créer le groupe'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Validation...' : 'Valider'}
                </button>
                <button
                  onClick={() => handleRejectProof(selectedProof._id, 'Preuve rejetée par l\'administrateur')}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Rejet...' : 'Rejeter'}
                </button>
                <button
                  onClick={() => setShowProofModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal invitation utilisateur */}
      {showInviteUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Inviter un utilisateur</h2>
              <button
                onClick={() => setShowInviteUserModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={inviteForm.nom}
                  onChange={(e) => setInviteForm({...inviteForm, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="collaborateur">Collaborateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowInviteUserModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleInviteUser}
                disabled={userActionLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {userActionLoading ? 'Invitation...' : 'Inviter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal création récompense */}
      {showCreateRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Créer une récompense</h2>
              <button
                onClick={() => setShowCreateRewardModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({...rewardForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Nom de la récompense"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({...rewardForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Description de la récompense"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Points *</label>
                  <input
                    type="number"
                    value={rewardForm.points}
                    onChange={(e) => setRewardForm({...rewardForm, points: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                  <input
                    type="text"
                    value={rewardForm.category}
                    onChange={(e) => setRewardForm({...rewardForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Écologique"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icône/Emoji</label>
                  <input
                    type="text"
                    value={rewardForm.image}
                    onChange={(e) => setRewardForm({...rewardForm, image: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="🏆"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rareté</label>
                  <select
                    value={rewardForm.rarity}
                    onChange={(e) => setRewardForm({...rewardForm, rarity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="common">Commune</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Épique</option>
                    <option value="legendary">Légendaire</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowCreateRewardModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateReward}
                disabled={recompenseLoading}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {recompenseLoading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal CreateChallengeModal (existing) */}
      <CreateChallengeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadChallenges}
      />
    </div>
  );
};

export default AdminDashboardNew;