import React, { useState, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { api } from '../lib/axios';
import '../utils/loginHelperDEV.js';

const NotificationTestPage = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error,
    refreshNotifications 
  } = useNotifications();
  
  const [creatingTest, setCreatingTest] = useState(false);

  // Créer une notification de test
  const createTestNotification = async () => {
    setCreatingTest(true);
    try {
      const response = await api.post('/notifications/test');
      console.log('✅ Notification de test créée:', response.data);
      // Rafraîchir les notifications
      await refreshNotifications();
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification de test:', error);
    } finally {
      setCreatingTest(false);
    }
  };

  // Debug des données
  useEffect(() => {
    console.log('🔔 Debug notifications:', {
      notifications,
      unreadCount,
      loading,
      error,
      notificationsLength: notifications?.length
    });
  }, [notifications, unreadCount, loading, error]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Test des Notifications</h1>
          
          {/* Boutons de test */}
          <div className="mb-6 space-x-4 flex flex-wrap gap-2">
            {!localStorage.getItem('token') && (
              <button
                onClick={() => window.quickLogin && window.quickLogin()}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
              >
                🔐 Connexion rapide (DEV)
              </button>
            )}
            
            <button
              onClick={createTestNotification}
              disabled={creatingTest}
              className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${
                creatingTest 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {creatingTest ? 'Création...' : 'Créer notification test'}
            </button>
            
            <button
              onClick={refreshNotifications}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
            >
              Rafraîchir
            </button>
            
            {localStorage.getItem('token') && (
              <button
                onClick={() => window.quickLogout && window.quickLogout()}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                🔓 Déconnexion
              </button>
            )}
          </div>

          {/* Debug Info */}
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Informations de debug :</h2>
            <div className="space-y-1 text-sm">
              <p><strong>Loading:</strong> {loading ? 'Oui' : 'Non'}</p>
              <p><strong>Error:</strong> {error || 'Aucune'}</p>
              <p><strong>Nombre de notifications:</strong> {notifications?.length || 0}</p>
              <p><strong>Non lues:</strong> {unreadCount}</p>
              <p><strong>Token présent:</strong> {localStorage.getItem('token') ? 'Oui' : 'Non'}</p>
            </div>
          </div>

          {/* Liste des notifications */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Notifications ({notifications?.length || 0})
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Chargement...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                Erreur: {error}
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id}
                    className={`p-4 border rounded-lg ${
                      notification.isRead 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          notification.isRead 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-blue-200 text-blue-700'
                        }`}>
                          {notification.isRead ? 'Lue' : 'Non lue'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune notification trouvée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;