/**
 * Service d'authentification professionnel avec JWT et refresh tokens
 * Gestion sécurisée des tokens et auto-refresh
 */

import { api } from '@/utils/apiClient';
import type { User, LoginForm, RegisterForm } from '@/types';

// Configuration des tokens
const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  USER_KEY: 'user_data',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes avant expiration
};

// Interface pour les réponses d'authentification
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // en secondes
}

interface TokenPayload {
  sub: string; // user ID
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expires at
}

class AuthService {
  private refreshPromise: Promise<string> | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;

  /**
   * Décode un JWT sans vérification (côté client uniquement)
   */
  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Vérifie si un token est expiré
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Date.now() / 1000;
    return payload.exp < now;
  }

  /**
   * Vérifie si un token expire bientôt
   */
  private isTokenExpiringSoon(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Date.now();
    const expiryTime = payload.exp * 1000;
    return (expiryTime - now) < TOKEN_CONFIG.TOKEN_EXPIRY_BUFFER;
  }

  /**
   * Stockage sécurisé des tokens
   */
  private setTokens(accessToken: string, refreshToken: string): void {
    // Utiliser sessionStorage pour plus de sécurité (optionnel)
    const storage = localStorage; // ou sessionStorage pour plus de sécurité
    
    storage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    storage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);

    // Programmer le refresh automatique
    this.scheduleTokenRefresh(accessToken);
  }

  /**
   * Récupération des tokens
   */
  public getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  }

  /**
   * Stockage des données utilisateur
   */
  private setUserData(user: User): void {
    localStorage.setItem(TOKEN_CONFIG.USER_KEY, JSON.stringify(user));
  }

  /**
   * Récupération des données utilisateur
   */
  public getUserData(): User | null {
    const userData = localStorage.getItem(TOKEN_CONFIG.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Programmation du refresh automatique
   */
  private scheduleTokenRefresh(token: string): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const payload = this.decodeToken(token);
    if (!payload) return;

    const now = Date.now();
    const expiryTime = payload.exp * 1000;
    const refreshTime = expiryTime - TOKEN_CONFIG.TOKEN_EXPIRY_BUFFER;
    const delay = Math.max(0, refreshTime - now);

    this.refreshTimer = setTimeout(() => {
      this.refreshAccessToken();
    }, delay);
  }

  /**
   * Refresh du token d'accès
   */
  public async refreshAccessToken(): Promise<string> {
    // Éviter les requêtes multiples simultanées
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    this.refreshPromise = this.performTokenRefresh(refreshToken);

    try {
      const newAccessToken = await this.refreshPromise;
      return newAccessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Exécution du refresh du token
   */
  private async performTokenRefresh(refreshToken: string): Promise<string> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Échec du refresh du token');
      }

      const data: AuthResponse = await response.json();
      
      // Mettre à jour les tokens
      this.setTokens(data.accessToken, data.refreshToken);
      this.setUserData(data.user);

      return data.accessToken;
    } catch (error) {
      // En cas d'erreur, déconnecter l'utilisateur
      this.logout();
      throw error;
    }
  }

  /**
   * Connexion
   */
  public async login(credentials: LoginForm): Promise<User> {
    try {
      const response = await api.post('/auth/login', credentials);
      const data: AuthResponse = response;

      // Stocker les tokens et données utilisateur
      this.setTokens(data.accessToken, data.refreshToken);
      this.setUserData(data.user);

      return data.user;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Inscription
   */
  public async register(userData: RegisterForm): Promise<User> {
    try {
      const response = await api.post('/auth/register', userData);
      const data: AuthResponse = response;

      // Stocker les tokens et données utilisateur
      this.setTokens(data.accessToken, data.refreshToken);
      this.setUserData(data.user);

      return data.user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Déconnexion
   */
  public async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      
      // Informer le serveur de la déconnexion
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion côté serveur:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.USER_KEY);

      // Annuler le timer de refresh
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    }
  }

  /**
   * Vérification de l'authentification
   */
  public isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return token !== null && !this.isTokenExpired(token);
  }

  /**
   * Récupération du token valide (avec refresh automatique si nécessaire)
   */
  public async getValidToken(): Promise<string | null> {
    const token = this.getAccessToken();
    
    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        return null;
      }
    }

    if (this.isTokenExpiringSoon(token)) {
      // Refresh en arrière-plan sans attendre
      this.refreshAccessToken().catch(console.error);
    }

    return token;
  }

  /**
   * Récupération du profil utilisateur actuel
   */
  public async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get('/auth/me');
      const user: User = response;
      
      // Mettre à jour les données locales
      this.setUserData(user);
      
      return user;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  /**
   * Changement de mot de passe
   */
  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  /**
   * Demande de réinitialisation de mot de passe
   */
  public async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      throw error;
    }
  }

  /**
   * Réinitialisation de mot de passe
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      throw error;
    }
  }
}

// Instance singleton
export const authService = new AuthService();

// Export des méthodes principales
export const {
  login,
  register,
  logout,
  isAuthenticated,
  getValidToken,
  getCurrentUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = authService;
