// src/pages/DashboardChallengeModern.jsx
import React, { useEffect, useMemo, useState } from "react";
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
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/axios";                  // ⚠️ instance axios
import ChallengeCard from "../components/ChallengeCard"; // ⚠️ carte défi
import { proofService } from "../services/proofService";
import { fetchUserStats, calculateBadges } from "../services/userStatsService";

/** Utilitaire: marche avec ou sans interceptor qui renvoie response.data */
const unwrap = (r) => (r && typeof r === "object" && "data" in r ? r.data : r);

/** Petit hook debounce pour la recherche */
function useDebounced(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function DashboardChallengeModern() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [q, setQ] = useState("");
  const qDebounced = useDebounced(q, 350);

  const [category, setCategory] = useState("Toutes les catégories");
  const [sort, setSort] = useState("recent"); // 'recent'|'popular'|'deadline'|'progress'
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    all: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
  });

  const [userProofs, setUserProofs] = useState([]);
  
  // États pour les vraies statistiques utilisateur
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    challengesCompleted: 0,
    currentStreak: 0,
    badges: [],
    weeklyGrowth: 0
  });
  const [pendingProofs, setPendingProofs] = useState([]);

  const status = useMemo(() => activeTab, [activeTab]);

  const tabs = [
    { id: "all", label: "Tous les défis", count: stats.all, color: "from-blue-500 to-cyan-500" },
    { id: "active", label: "En cours", count: stats.active, color: "from-green-500 to-emerald-500" },
    { id: "upcoming", label: "À venir", count: stats.upcoming, color: "from-yellow-500 to-orange-500" },
    { id: "completed", label: "Terminés", count: stats.completed, color: "from-purple-500 to-pink-500" },
  ];

  const categories = [
    "Toutes les catégories",
    "Solidaire",
    "Écologique",
    "Créatif",
    "Sportif",
    "Éducatif",
    "Bien-être",
  ];

  const sortLabelByKey = {
    recent: "Plus récents",
    popular: "Plus populaires",
    deadline: "Deadline proche",
    progress: "Progression",
  };
  const sortKeyByLabel = Object.fromEntries(
    Object.entries(sortLabelByKey).map(([k, v]) => [v, k])
  );

  // Charger les stats et les preuves de l'utilisateur au premier rendu
  useEffect(() => {
    (async () => {
      try {
        // Charger les stats des défis
        const data = unwrap(await api.get("/challenges/stats"));
        setStats(data);
        
        // Charger les statistiques utilisateur réelles
        try {
          const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
          if (token) {
            const realUserStats = await fetchUserStats(token);
            
            // Calculer la croissance hebdomadaire (simulation basée sur les données)
            const weeklyGrowth = Math.max(0, Math.min(50, realUserStats.currentStreak * 3));
            
            setUserStats({
              ...realUserStats,
              weeklyGrowth
            });
            
            console.log('📊 Statistiques utilisateur chargées:', realUserStats);
          } else {
            console.log('ℹ️ Utilisateur non connecté, utilisation de stats vides');
          }
        } catch (userStatsError) {
          console.log('ℹ️ Impossible de charger les statistiques utilisateur, utilisation de stats vides');
        }
        
        // Charger les preuves de l'utilisateur
        try {
          const proofsResponse = await proofService.getMyProofs();
          const proofs = proofsResponse.proofs || [];
          setUserProofs(proofs);
          
          // Identifier les preuves en attente de validation
          const pending = proofs.filter(proof => proof.status === 'pending' || proof.status === 'submitted');
          setPendingProofs(pending);
          
          console.log(`📋 ${proofs.length} preuves chargées pour l'utilisateur (${pending.length} en attente)`);
        } catch (proofsError) {
          console.log('ℹ️ Impossible de charger les preuves (utilisateur non connecté?)');
          setUserProofs([]);
          setPendingProofs([]);
        }
      } catch (e) {
        console.error("stats error", e);
      }
    })();
  }, []);

  // Fetch de la liste
  const fetchList = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
      };
      
      // Ajouter les paramètres seulement s'ils ont une valeur
      if (qDebounced && qDebounced.trim()) {
        params.q = qDebounced.trim();
      }
      
      if (category && category !== "Toutes les catégories") {
        params.category = category;
      }
      
      if (status && status !== "all") {
        params.status = status;
      }
      
      if (sort) {
        params.sort = sort;
      }
      
      console.log("Paramètres de recherche:", params);
      console.log("URL complète:", `/challenges?${new URLSearchParams(params).toString()}`);
      
      const data = await api.get("/challenges", { params });
      console.log("Données reçues de l'API:", data);
      
      const items = data.items || data.challenges || data.data || [];
      const total = data?.pagination?.total || data?.total || data?.count || 0;
      
      console.log("Items extraits:", items);
      console.log("Total extrait:", total);
      
      setItems(items);
      setTotal(total);
    } catch (e) {
      console.error("fetchList error", e);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Recharger quand les filtres changent
  useEffect(() => {
    fetchList().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced, category, status, sort]);

  // Fermer le dropdown des filtres quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilters && !event.target.closest('.filter-dropdown')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      {/* Header */}
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

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">
                {userStats.weeklyGrowth > 0 
                  ? `+${userStats.weeklyGrowth}% cette semaine`
                  : userStats.currentStreak > 0 
                    ? `${userStats.currentStreak} jours de série`
                    : 'Commencez votre aventure!'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-600">
                {userStats.badges.length > 0 
                  ? `${userStats.badges.length} badge${userStats.badges.length > 1 ? 's' : ''} débloqué${userStats.badges.length > 1 ? 's' : ''}`
                  : 'Aucun badge pour l\'instant'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">
                {stats.active > 0 
                  ? `${stats.active} défi${stats.active > 1 ? 's' : ''} actif${stats.active > 1 ? 's' : ''}`
                  : 'Aucun défi actif'
                }
              </span>
            </div>
            {pendingProofs.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200">
                <span className="text-yellow-600">🟡</span>
                <span className="text-yellow-700 font-medium">
                  {pendingProofs.length} preuve{pendingProofs.length > 1 ? 's' : ''} — en attente de validation
                </span>
              </div>
            )}
          </div>
        </div>

        <button className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold">Proposer un défi</span>
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="space-y-6">
        {/* Recherche */}
        <div className="relative">
          <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl px-6 py-4 shadow-inner">
            <Search className="text-gray-500 mr-4" size={20} />
            <input
              type="text"
              placeholder="Rechercher un défi par nom, catégorie ou mot-clé..."
              className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-500 font-medium"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="ml-4 text-xs bg-white px-3 py-1 rounded-full text-gray-500 border">⌘K</div>
          </div>
        </div>

        {/* Filtres + vues */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative filter-dropdown">
              <button
                onClick={() => setShowFilters((s) => !s)}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter size={16} className="text-gray-600" />
                <span className="text-gray-700 text-sm font-medium">
                  {category === "Toutes les catégories" ? "Filtres" : category}
                </span>
                {category !== "Toutes les catégories" && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">1</span>
                )}
                <ChevronDown
                  size={16}
                  className={`text-gray-500 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 min-w-[200px] z-10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Catégories
                      </div>
                      {category !== "Toutes les catégories" && (
                        <button
                          onClick={() => {
                            setCategory("Toutes les catégories");
                            setShowFilters(false);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Réinitialiser
                        </button>
                      )}
                    </div>
                    {categories.map((catLabel) => (
                      <button
                        key={catLabel}
                        onClick={() => {
                          console.log("Catégorie sélectionnée:", catLabel);
                          setCategory(catLabel);
                          setShowFilters(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors duration-150 ${
                          category === catLabel 
                            ? "bg-blue-50 text-blue-600 font-medium" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {catLabel}
                        {category === catLabel && (
                          <span className="float-right text-blue-500">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-gray-600 text-sm">Trier par:</span>
              <select
                className="bg-transparent outline-none text-sm text-gray-700 font-medium cursor-pointer"
                value={sortLabelByKey[sort]}
                onChange={(e) => {
                  const newSort = sortKeyByLabel[e.target.value] || "recent";
                  console.log("Tri sélectionné:", newSort);
                  setSort(newSort);
                }}
              >
                {Object.values(sortLabelByKey).map((label) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Switch vue */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Grid size={16} />
              <span className="text-sm font-medium">Grille</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-600 hover:text-gray-800"
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
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{tab.label}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-2xl" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Indicateur de résultats */}
      <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
        <span>{loading ? "Chargement..." : `Affichage de ${items.length} défis sur ${total} au total`}</span>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>Mise à jour en temps réel</span>
        </div>
      </div>

      {/* LISTE / GRILLE */}
      <div className={`mt-6 ${viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}`}>
        {items.map((ch) => (
          <ChallengeCard
            key={ch._id}
            data={ch}
            view={viewMode}
            onClick={() => navigate(`/challenges/${ch._id}`)}
            userProofs={userProofs}
          />
        ))}

        {!loading && items.length === 0 && (
          <div className="text-gray-500 text-sm col-span-full">Aucun défi trouvé avec ces filtres.</div>
        )}
      </div>
    </div>
  );
}

