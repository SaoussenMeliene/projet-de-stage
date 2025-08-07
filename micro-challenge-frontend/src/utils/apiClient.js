import { API_CONFIG, ERROR_MESSAGES } from './constants';

/**
 * Client API amélioré avec gestion d'erreurs et retry automatique
 * Centralise toutes les requêtes API
 */
class ApiClient {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.retryAttempts = API_CONFIG.RETRY_ATTEMPTS;
  }

  /**
   * Récupère le token d'authentification
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Crée les headers par défaut
   */
  getDefaultHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Gère les erreurs HTTP
   */
  handleHttpError(response) {
    switch (response.status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
      case 403:
        throw new Error(ERROR_MESSAGES.FORBIDDEN);
      case 404:
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      case 500:
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      default:
        throw new Error(ERROR_MESSAGES.GENERIC);
    }
  }

  /**
   * Effectue une requête avec retry automatique
   */
  async requestWithRetry(url, options, attempt = 1) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...this.getDefaultHeaders(),
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        this.handleHttpError(response);
      }

      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.NETWORK);
      }

      // Retry pour les erreurs réseau
      if (attempt < this.retryAttempts && error.message === ERROR_MESSAGES.NETWORK) {
        console.warn(`Tentative ${attempt} échouée, retry dans 1s...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        return this.requestWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Méthode GET
   */
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await this.requestWithRetry(url.toString(), {
      method: 'GET',
    });

    return response.json();
  }

  /**
   * Méthode POST
   */
  async post(endpoint, data = {}) {
    const response = await this.requestWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    return response.json();
  }

  /**
   * Méthode PUT
   */
  async put(endpoint, data = {}) {
    const response = await this.requestWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response.json();
  }

  /**
   * Méthode DELETE
   */
  async delete(endpoint) {
    const response = await this.requestWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
    });

    return response.json();
  }

  /**
   * Upload de fichier
   */
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await this.requestWithRetry(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        // Ne pas définir Content-Type pour FormData
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });

    return response.json();
  }
}

// Instance singleton
export const apiClient = new ApiClient();

// Méthodes de convenance
export const api = {
  get: (endpoint, params) => apiClient.get(endpoint, params),
  post: (endpoint, data) => apiClient.post(endpoint, data),
  put: (endpoint, data) => apiClient.put(endpoint, data),
  delete: (endpoint) => apiClient.delete(endpoint),
  uploadFile: (endpoint, file, data) => apiClient.uploadFile(endpoint, file, data),
};
