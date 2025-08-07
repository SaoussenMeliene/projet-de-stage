import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Target,
  TrendingUp,
  Award,
  Clock,
  ChevronDown,
  Zap
} from "lucide-react";

export default function DashboardChallengeModern() {
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const tabs = [
    { id: 'all', label: 'Tous les défis', count: 10, color: 'from-blue-500 to-cyan-500' },
    { id: 'active', label: 'En cours', count: 2, color: 'from-green-500 to-emerald-500' },
    { id: 'upcoming', label: 'À venir', count: 3, color: 'from-yellow-500 to-orange-500' },
    { id: 'completed', label: 'Terminés', count: 5, color: 'from-purple-500 to-pink-500' },
  ];

  const categories = [
    'Toutes les catégories',
    'Solidaire',
    'Écologique', 
    'Créatif',
    'Sportif',
    'Éducatif'
  ];

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      {/* Header avec statistiques personnelles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Target className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Mes Défis
              </h1>
              <p className="text-gray-600">
                Gérez vos défis en cours et découvrez de nouveaux challenges à relever.
              </p>
            </div>
          </div>
          
          {/* Mini statistiques */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">+15% cette semaine</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">3 badges débloqués</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">2 défis actifs</span>
            </div>
          </div>
        </div>

        <button className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold">Proposer un défi</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="space-y-6">
        {/* Recherche principale */}
        <div className="relative">
          <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-6 py-4 shadow-inner">
            <Search className="text-gray-500 mr-4" size={20} />
            <input
              type="text"
              placeholder="Rechercher un défi par nom, catégorie ou mot-clé..."
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500 font-medium"
            />
            <div className="ml-4 text-xs bg-white px-3 py-1 rounded-full text-gray-500 border">
              ⌘K
            </div>
          </div>
        </div>

        {/* Filtres et vues */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Filtres */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter size={16} className="text-gray-600" />
                <span className="text-gray-700 text-sm font-medium">Filtres</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[200px] z-10">
                  <div className="space-y-2">
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-gray-600 text-sm">Trier par:</span>
              <select className="bg-transparent outline-none text-sm text-gray-700 font-medium">
                <option>Plus récents</option>
                <option>Plus populaires</option>
                <option>Deadline proche</option>
                <option>Progression</option>
              </select>
            </div>
          </div>

          {/* Switch vue grille / liste */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={16} />
              <span className="text-sm font-medium">Grille</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={16} />
              <span className="text-sm font-medium">Liste</span>
            </button>
          </div>
        </div>

        {/* Onglets de statut */}
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{tab.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </div>
              
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de résultats */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>Affichage de 10 défis sur 25 au total</span>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>Mise à jour en temps réel</span>
        </div>
      </div>
    </div>
  );
}
