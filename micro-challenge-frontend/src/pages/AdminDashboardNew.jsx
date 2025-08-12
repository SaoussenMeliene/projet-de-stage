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
  AlertCircle
} from "lucide-react";
import HeaderDashboard from "../components/HeaderDashboard";
import CreateChallengeModal from "../components/CreateChallengeModal";

const AdminDashboardNew = () => {
  const navigate = useNavigate();

  // Données de démonstration pour les défis (déplacé ici pour éviter l'erreur de référence)
  const defis = [
    {
      id: 1,
      titre: "Défi Écologique",
      categorie: "Environnement",
      difficulte: "Facile",
      participants: 35,
      statut: "Actif",
      dateCreation: "2024-01-15",
      description: "Réduire sa consommation d'eau pendant 7 jours"
    },
    {
      id: 2,
      titre: "Défi Fitness",
      categorie: "Sport",
      difficulte: "Moyen",
      participants: 28,
      statut: "Actif",
      dateCreation: "2024-01-10",
      description: "Faire 10 000 pas par jour pendant une semaine"
    },
    {
      id: 3,
      titre: "Défi Solidaire",
      categorie: "Social",
      difficulte: "Facile",
      participants: 42,
      statut: "Terminé",
      dateCreation: "2024-01-05",
      description: "Aider 3 personnes différentes dans la semaine"
    }
  ];

  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defisState, setDefisState] = useState(defis);

  // Vérification des droits d'administration
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
    
    setLoading(false);
  }, [navigate]);

  // Données de démonstration pour les statistiques
  const stats = {
    totalDefis: { value: 24, change: '+2 ce mois', trend: 'up' },
    utilisateurs: { value: 156, change: '+12 ce mois', trend: 'up' },
    preuvesAttente: { value: 8, change: 'À valider', trend: 'warning' },
    groupesActifs: { value: 12, change: '+1 ce mois', trend: 'up' }
  };



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

  // Données de démonstration pour les preuves en attente
  const preuvesAttente = [
    {
      id: 1,
      utilisateur: "Ahmed Bhk",
      defi: "Défi Écologique",
      dateSubmission: "2024-08-09",
      type: "Photo",
      statut: "En attente"
    },
    {
      id: 2,
      utilisateur: "Marie Dupont",
      defi: "Défi Fitness",
      dateSubmission: "2024-08-08",
      type: "Vidéo",
      statut: "En attente"
    }
  ];

  // Fonction pour sauvegarder un nouveau défi
  const handleSaveChallenge = (newChallenge) => {
    setDefisState([...defisState, newChallenge]);
    console.log('✅ Nouveau défi créé:', newChallenge);
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
                <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Toutes les catégories</option>
                  <option>Environnement</option>
                  <option>Sport</option>
                  <option>Social</option>
                </select>
                <select className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Tous les statuts</option>
                  <option>Actif</option>
                  <option>Terminé</option>
                  <option>Brouillon</option>
                </select>
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
                    {defisState.map((defi) => (
                      <tr key={defi.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-800">{defi.titre}</div>
                            <div className="text-sm text-gray-500">{defi.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {defi.categorie}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            defi.difficulte === 'Facile' ? 'bg-green-100 text-green-800' :
                            defi.difficulte === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {defi.difficulte}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-800">{defi.participants}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                            defi.statut === 'Actif' ? 'bg-green-100 text-green-800' :
                            defi.statut === 'Terminé' ? 'bg-gray-100 text-gray-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {defi.statut}
                          </span>
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
                              <Trash2 size={16} />
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

        {/* Onglet Validation */}
        {activeTab === 'validation' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Validation des Preuves</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle size={16} />
                <span>{preuvesAttente.length} preuves en attente</span>
              </div>
            </div>

            {/* Liste des preuves en attente */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Preuves en attente de validation</h3>
              </div>

              <div className="divide-y divide-gray-100">
                {preuvesAttente.map((preuve) => (
                  <div key={preuve.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                            <FileText className="text-gray-600 w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{preuve.defi}</h4>
                            <p className="text-sm text-gray-600">Soumis par {preuve.utilisateur}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Type: {preuve.type}</span>
                          <span>•</span>
                          <span>Soumis le {new Date(preuve.dateSubmission).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                          Approuver
                        </button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Rejeter
                        </button>
                        <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  );
};

export default AdminDashboardNew;
