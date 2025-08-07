import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { groupServiceImproved } from '../services/groupServiceImproved';

/**
 * Store Zustand professionnel pour la gestion des groupes
 * Utilise les middlewares pour le debugging, la persistance et l'immutabilité
 */

const initialState = {
  // État des données
  groups: [],
  selectedGroup: null,
  
  // États de chargement
  loading: {
    groups: false,
    creating: false,
    updating: false,
    deleting: false
  },
  
  // Gestion des erreurs
  errors: {
    groups: null,
    create: null,
    update: null,
    delete: null
  },
  
  // Métadonnées
  lastFetch: null,
  totalCount: 0,
  
  // Filtres et pagination
  filters: {
    search: '',
    status: 'all',
    category: 'all'
  },
  pagination: {
    page: 1,
    limit: 12,
    hasMore: true
  }
};

export const useGroupStore = create(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Actions pour charger les groupes
        fetchGroups: async (options = {}) => {
          const { force = false } = options;
          const state = get();
          
          // Éviter les requêtes multiples
          if (state.loading.groups && !force) return;
          
          // Cache intelligent - éviter de recharger si récent
          const now = Date.now();
          const lastFetch = state.lastFetch;
          const cacheTimeout = 5 * 60 * 1000; // 5 minutes
          
          if (!force && lastFetch && (now - lastFetch) < cacheTimeout) {
            return state.groups;
          }

          set((state) => {
            state.loading.groups = true;
            state.errors.groups = null;
          });

          try {
            const params = {
              page: state.pagination.page,
              limit: state.pagination.limit,
              search: state.filters.search,
              status: state.filters.status !== 'all' ? state.filters.status : undefined,
              category: state.filters.category !== 'all' ? state.filters.category : undefined
            };

            const response = await groupServiceImproved.getUserGroups(params);
            
            set((state) => {
              state.groups = response.data || response;
              state.totalCount = response.total || response.length;
              state.pagination.hasMore = response.hasMore || false;
              state.lastFetch = now;
              state.loading.groups = false;
              state.errors.groups = null;
            });

            return response.data || response;
          } catch (error) {
            set((state) => {
              state.loading.groups = false;
              state.errors.groups = error.message;
            });
            throw error;
          }
        },

        // Action pour créer un groupe
        createGroup: async (groupData) => {
          set((state) => {
            state.loading.creating = true;
            state.errors.create = null;
          });

          try {
            const newGroup = await groupServiceImproved.createGroup(groupData);
            
            set((state) => {
              state.groups.unshift(newGroup);
              state.totalCount += 1;
              state.loading.creating = false;
              state.errors.create = null;
            });

            return newGroup;
          } catch (error) {
            set((state) => {
              state.loading.creating = false;
              state.errors.create = error.message;
            });
            throw error;
          }
        },

        // Action pour mettre à jour un groupe
        updateGroup: async (groupId, updates) => {
          set((state) => {
            state.loading.updating = true;
            state.errors.update = null;
          });

          try {
            const updatedGroup = await groupServiceImproved.updateGroup(groupId, updates);
            
            set((state) => {
              const index = state.groups.findIndex(g => g.id === groupId);
              if (index !== -1) {
                state.groups[index] = { ...state.groups[index], ...updatedGroup };
              }
              
              if (state.selectedGroup?.id === groupId) {
                state.selectedGroup = { ...state.selectedGroup, ...updatedGroup };
              }
              
              state.loading.updating = false;
              state.errors.update = null;
            });

            return updatedGroup;
          } catch (error) {
            set((state) => {
              state.loading.updating = false;
              state.errors.update = error.message;
            });
            throw error;
          }
        },

        // Action pour supprimer un groupe
        deleteGroup: async (groupId) => {
          set((state) => {
            state.loading.deleting = true;
            state.errors.delete = null;
          });

          try {
            await groupServiceImproved.deleteGroup(groupId);
            
            set((state) => {
              state.groups = state.groups.filter(g => g.id !== groupId);
              state.totalCount -= 1;
              
              if (state.selectedGroup?.id === groupId) {
                state.selectedGroup = null;
              }
              
              state.loading.deleting = false;
              state.errors.delete = null;
            });
          } catch (error) {
            set((state) => {
              state.loading.deleting = false;
              state.errors.delete = error.message;
            });
            throw error;
          }
        },

        // Sélection d'un groupe
        selectGroup: (group) => {
          set((state) => {
            state.selectedGroup = group;
          });
        },

        // Gestion des filtres
        setFilters: (newFilters) => {
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
            state.pagination.page = 1; // Reset pagination
          });
          
          // Recharger avec les nouveaux filtres
          get().fetchGroups({ force: true });
        },

        // Gestion de la pagination
        setPage: (page) => {
          set((state) => {
            state.pagination.page = page;
          });
          
          get().fetchGroups({ force: true });
        },

        // Recherche
        search: (query) => {
          set((state) => {
            state.filters.search = query;
            state.pagination.page = 1;
          });
          
          // Debounce la recherche
          clearTimeout(get().searchTimeout);
          const timeout = setTimeout(() => {
            get().fetchGroups({ force: true });
          }, 300);
          
          set((state) => {
            state.searchTimeout = timeout;
          });
        },

        // Reset des erreurs
        clearErrors: () => {
          set((state) => {
            state.errors = { ...initialState.errors };
          });
        },

        // Reset du store
        reset: () => {
          set(initialState);
        },

        // Sélecteurs optimisés
        getGroupById: (id) => {
          return get().groups.find(group => group.id === id);
        },

        getFilteredGroups: () => {
          const { groups, filters } = get();
          
          return groups.filter(group => {
            const matchesSearch = !filters.search || 
              group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              group.description.toLowerCase().includes(filters.search.toLowerCase());
            
            const matchesStatus = filters.status === 'all' || group.status === filters.status;
            const matchesCategory = filters.category === 'all' || group.category === filters.category;
            
            return matchesSearch && matchesStatus && matchesCategory;
          });
        },

        // Statistiques
        getStats: () => {
          const groups = get().groups;
          
          return {
            total: groups.length,
            active: groups.filter(g => g.status === 'active').length,
            inactive: groups.filter(g => g.status === 'inactive').length,
            totalMembers: groups.reduce((sum, g) => sum + (g.memberCount || 0), 0),
            totalPoints: groups.reduce((sum, g) => sum + (g.points || 0), 0)
          };
        }
      })),
      {
        name: 'group-store',
        partialize: (state) => ({
          // Persister seulement certaines parties du state
          selectedGroup: state.selectedGroup,
          filters: state.filters,
          pagination: state.pagination
        })
      }
    ),
    {
      name: 'group-store' // Nom pour les DevTools
    }
  )
);

// Hook pour utiliser le store avec des sélecteurs optimisés
export const useGroups = () => {
  const groups = useGroupStore(state => state.groups);
  const loading = useGroupStore(state => state.loading);
  const errors = useGroupStore(state => state.errors);
  const actions = useGroupStore(state => ({
    fetchGroups: state.fetchGroups,
    createGroup: state.createGroup,
    updateGroup: state.updateGroup,
    deleteGroup: state.deleteGroup,
    selectGroup: state.selectGroup,
    setFilters: state.setFilters,
    search: state.search,
    clearErrors: state.clearErrors
  }));

  return {
    groups,
    loading,
    errors,
    ...actions
  };
};
