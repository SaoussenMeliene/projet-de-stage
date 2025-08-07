/**
 * Constantes de l'application
 * Centralise toutes les valeurs constantes pour faciliter la maintenance
 */

// Configuration API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  TIMEOUT: 10000, // 10 secondes
  RETRY_ATTEMPTS: 3
};

// Couleurs et thèmes
export const THEME_COLORS = {
  AVATAR_GRADIENTS: [
    "from-blue-500 to-purple-500",
    "from-green-500 to-emerald-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-cyan-500 to-blue-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-yellow-500 to-orange-500"
  ],
  THEME_NAMES: ["blue", "green", "purple", "orange", "cyan", "pink", "indigo", "yellow"],
  STATUS_COLORS: {
    'Très actif': 'bg-green-100 text-green-700',
    'Actif': 'bg-blue-100 text-blue-700',
    'En cours': 'bg-yellow-100 text-yellow-700',
    'Inactif': 'bg-gray-100 text-gray-700'
  }
};

// Icônes par catégorie
export const CATEGORY_ICONS = {
  'écologique': 'Leaf',
  'environnement': 'Leaf',
  'technologie': 'Code',
  'tech': 'Code',
  'marketing': 'Briefcase',
  'communication': 'Briefcase',
  'sport': 'Trophy',
  'santé': 'Heart',
  'éducation': 'BookOpen',
  'finance': 'DollarSign',
  'default': 'Target'
};

// Seuils et limites
export const LIMITS = {
  GROUP_STATUS: {
    VERY_ACTIVE: 10,
    ACTIVE: 5
  },
  MESSAGE: {
    MAX_LENGTH: 1000,
    MIN_LENGTH: 1
  },
  PAGINATION: {
    GROUPS_PER_PAGE: 12,
    MESSAGES_PER_PAGE: 50
  }
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK: "Erreur de connexion. Vérifiez votre connexion internet.",
  UNAUTHORIZED: "Session expirée. Veuillez vous reconnecter.",
  FORBIDDEN: "Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: "Ressource non trouvée.",
  SERVER_ERROR: "Erreur serveur. Veuillez réessayer plus tard.",
  VALIDATION: "Données invalides. Vérifiez vos informations.",
  GENERIC: "Une erreur inattendue s'est produite."
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  GROUP_CREATED: "Groupe créé avec succès !",
  GROUP_UPDATED: "Groupe mis à jour avec succès !",
  GROUP_DELETED: "Groupe supprimé avec succès !",
  MEMBER_ADDED: "Membre ajouté avec succès !",
  MEMBER_REMOVED: "Membre retiré avec succès !",
  MESSAGE_SENT: "Message envoyé avec succès !",
  PROFILE_UPDATED: "Profil mis à jour avec succès !"
};

// Durées d'animation
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000
};

// Breakpoints responsive
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};

// Rôles utilisateur
export const USER_ROLES = {
  ADMIN: 'admin',
  COLLABORATEUR: 'collaborateur',
  MODERATEUR: 'moderateur'
};

// Types d'onglets
export const TAB_TYPES = {
  MESSAGERIE: 'messagerie',
  SONDAGES: 'sondages',
  GALERIE: 'galerie',
  FICHIERS: 'fichiers'
};

// Formats de date
export const DATE_FORMATS = {
  FULL: 'DD/MM/YYYY HH:mm',
  DATE_ONLY: 'DD/MM/YYYY',
  TIME_ONLY: 'HH:mm',
  RELATIVE: 'relative' // il y a 2 heures
};
