/**
 * Types TypeScript professionnels pour l'application
 * Définit tous les types de données de manière stricte et réutilisable
 */

// ============================================================================
// TYPES DE BASE
// ============================================================================

export type ID = string | number;

export type Timestamp = string; // ISO 8601 format

export type Status = 'active' | 'inactive' | 'pending' | 'archived';

export type UserRole = 'admin' | 'collaborateur' | 'moderateur';

// ============================================================================
// UTILISATEUR
// ============================================================================

export interface User {
  id: ID;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences: UserPreferences;
  stats: UserStats;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'fr' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacy: {
    profileVisible: boolean;
    statsVisible: boolean;
  };
}

export interface UserStats {
  totalPoints: number;
  groupsJoined: number;
  challengesCompleted: number;
  messagesCount: number;
  rank: number;
}

// ============================================================================
// GROUPE
// ============================================================================

export interface Group {
  id: ID;
  name: string;
  description: string;
  avatar?: string;
  avatarColor: string;
  category: GroupCategory;
  status: Status;
  visibility: 'public' | 'private' | 'invite-only';
  memberCount: number;
  maxMembers?: number;
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Relations
  members?: GroupMember[];
  challenge?: Challenge;
  stats?: GroupStats;
  settings?: GroupSettings;
}

export type GroupCategory = 
  | 'écologique' 
  | 'technologie' 
  | 'marketing' 
  | 'sport' 
  | 'santé' 
  | 'éducation' 
  | 'finance'
  | 'autre';

export interface GroupMember {
  id: ID;
  userId: ID;
  groupId: ID;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Timestamp;
  isActive: boolean;
  
  // Relations
  user?: User;
}

export interface GroupStats {
  totalPoints: number;
  totalMembers: number;
  activeParticipants: number;
  messagesCount: number;
  challengesCompleted: number;
  averageEngagement: number;
  weeklyActivity: number[];
}

export interface GroupSettings {
  allowInvites: boolean;
  requireApproval: boolean;
  allowFileUploads: boolean;
  maxFileSize: number; // en MB
  allowedFileTypes: string[];
  moderationEnabled: boolean;
}

// ============================================================================
// DÉFI/CHALLENGE
// ============================================================================

export interface Challenge {
  id: ID;
  title: string;
  description: string;
  category: GroupCategory;
  difficulty: 'facile' | 'moyen' | 'difficile';
  points: number;
  duration: number; // en jours
  status: Status;
  startDate: Timestamp;
  endDate: Timestamp;
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Relations
  groups?: Group[];
  participants?: ChallengeParticipant[];
  tasks?: ChallengeTask[];
  rewards?: ChallengeReward[];
}

export interface ChallengeParticipant {
  id: ID;
  userId: ID;
  challengeId: ID;
  status: 'enrolled' | 'in-progress' | 'completed' | 'abandoned';
  progress: number; // 0-100
  pointsEarned: number;
  startedAt: Timestamp;
  completedAt?: Timestamp;
  
  // Relations
  user?: User;
  submissions?: ChallengeSubmission[];
}

export interface ChallengeTask {
  id: ID;
  challengeId: ID;
  title: string;
  description: string;
  order: number;
  points: number;
  isRequired: boolean;
  validationType: 'manual' | 'automatic' | 'peer-review';
  
  // Validation rules
  validationRules?: {
    minValue?: number;
    maxValue?: number;
    allowedFormats?: string[];
    requiresEvidence?: boolean;
  };
}

export interface ChallengeSubmission {
  id: ID;
  participantId: ID;
  taskId: ID;
  content: string;
  attachments?: FileAttachment[];
  status: 'pending' | 'approved' | 'rejected' | 'needs-revision';
  submittedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: ID;
  feedback?: string;
  pointsAwarded: number;
}

export interface ChallengeReward {
  id: ID;
  challengeId: ID;
  type: 'badge' | 'points' | 'certificate' | 'physical';
  name: string;
  description: string;
  icon?: string;
  value: number;
  criteria: {
    minPoints?: number;
    completionRate?: number;
    timeLimit?: number;
  };
}

// ============================================================================
// MESSAGERIE
// ============================================================================

export interface Message {
  id: ID;
  groupId: ID;
  authorId: ID;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  attachments?: FileAttachment[];
  replyTo?: ID;
  reactions?: MessageReaction[];
  isEdited: boolean;
  isPinned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Relations
  author?: User;
  replies?: Message[];
}

export interface MessageReaction {
  id: ID;
  messageId: ID;
  userId: ID;
  emoji: string;
  createdAt: Timestamp;
  
  // Relations
  user?: User;
}

export interface FileAttachment {
  id: ID;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number; // en bytes
  url: string;
  thumbnailUrl?: string;
  uploadedBy: ID;
  uploadedAt: Timestamp;
}

// ============================================================================
// API & RESPONSES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, any>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// FORMULAIRES
// ============================================================================

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface GroupForm {
  name: string;
  description: string;
  category: GroupCategory;
  visibility: Group['visibility'];
  maxMembers?: number;
  allowInvites?: boolean;
  requireApproval?: boolean;
}

export interface MessageForm {
  content: string;
  attachments?: File[];
  replyTo?: ID;
}

// ============================================================================
// ÉTAT GLOBAL
// ============================================================================

export interface AppState {
  auth: AuthState;
  groups: GroupState;
  challenges: ChallengeState;
  messages: MessageState;
  ui: UIState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface GroupState {
  groups: Group[];
  selectedGroup: Group | null;
  loading: {
    groups: boolean;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
  };
  errors: {
    groups: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
  filters: FilterParams;
  pagination: PaginationParams & { hasMore: boolean };
}

export interface ChallengeState {
  challenges: Challenge[];
  selectedChallenge: Challenge | null;
  userChallenges: ChallengeParticipant[];
  loading: boolean;
  error: string | null;
}

export interface MessageState {
  messages: Record<ID, Message[]>; // groupId -> messages
  loading: Record<ID, boolean>;
  errors: Record<ID, string | null>;
  typing: Record<ID, ID[]>; // groupId -> userIds typing
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  modals: {
    createGroup: boolean;
    editProfile: boolean;
    confirmDelete: boolean;
  };
}

export interface Notification {
  id: ID;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  createdAt: Timestamp;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  variant?: 'primary' | 'secondary';
}

// ============================================================================
// UTILITAIRES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EventHandler<T = any> = (event: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;
