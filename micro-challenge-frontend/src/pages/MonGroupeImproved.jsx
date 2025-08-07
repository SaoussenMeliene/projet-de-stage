import React, { useState, useEffect } from "react";
import { Plus, Users } from "lucide-react";

// Hooks personnalisés
import { useGroups } from "../hooks/useGroups";
import { useAuth } from "../hooks/useAuth";

// Composants
import HeaderDashboard from "../components/HeaderDashboard";
import AddMemberModal from "../components/AddMemberModal";
import GroupCard from "../components/GroupCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";

// Constantes
import { ANIMATION_DURATIONS } from "../utils/constants";

/**
 * Composant principal amélioré pour la gestion des groupes
 * Architecture modulaire et séparation des responsabilités
 */
const MonGroupeImproved = () => {
  // États locaux
  const [isVisible, setIsVisible] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  // Hooks personnalisés
  const { groups, loading, error, refreshGroups } = useGroups();
  const { userRole, isAuthenticated } = useAuth();

  // Effet d'animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Gestionnaires d'événements
  const handleGroupSelect = (group) => {
    // Navigation vers la vue détaillée du groupe
    console.log("Sélection du groupe:", group);
    // Ici vous pouvez implémenter la navigation ou l'ouverture du chat
  };

  const handleAddMember = (groupId) => {
    setSelectedGroupId(groupId);
    setShowAddMemberModal(true);
  };

  const handleMemberAdded = () => {
    refreshGroups();
    setShowAddMemberModal(false);
  };

  const handleCreateGroup = () => {
    // Navigation vers la création de groupe
    console.log("Création d'un nouveau groupe");
  };

  const handleDiscoverChallenges = () => {
    window.location.href = '/mes-defis';
  };

  // Vérification de l'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Veuillez vous connecter pour accéder à cette page.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#f0f9f6]">
        <HeaderDashboard />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className={`mb-8 transition-all duration-${ANIMATION_DURATIONS.VERY_SLOW} ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="mb-6 lg:mb-0">
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Groupes</h1>
                  <p className="text-gray-600 text-lg">
                    Collaborez avec vos collègues pour relever des défis ensemble
                  </p>
                </div>

                {userRole === 'admin' && (
                  <button 
                    onClick={handleCreateGroup}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                  >
                    <Plus size={20} />
                    <span>Créer un groupe</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* État de chargement */}
          {loading && (
            <LoadingSpinner 
              size="lg" 
              text="Chargement des groupes..." 
              className="py-16"
            />
          )}

          {/* État d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={refreshGroups}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Grille des groupes */}
          {!loading && !error && (
            <div className={`transition-all duration-${ANIMATION_DURATIONS.VERY_SLOW} delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              {groups.length === 0 ? (
                <EmptyGroupsState onDiscoverChallenges={handleDiscoverChallenges} />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {groups.map((group, index) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      index={index}
                      userRole={userRole}
                      onGroupSelect={handleGroupSelect}
                      onAddMember={handleAddMember}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal d'ajout de membre */}
        {showAddMemberModal && (
          <AddMemberModal
            groupId={selectedGroupId}
            onClose={() => setShowAddMemberModal(false)}
            onMemberAdded={handleMemberAdded}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

/**
 * Composant pour l'état vide (aucun groupe)
 */
const EmptyGroupsState = ({ onDiscoverChallenges }) => (
  <div className="col-span-full">
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">Aucun groupe trouvé</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Rejoignez un défi pour être automatiquement ajouté à un groupe et commencer à collaborer !
      </p>
      <button
        onClick={onDiscoverChallenges}
        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        Découvrir tous les défis
      </button>
    </div>
  </div>
);

export default MonGroupeImproved;
