import React, { useState, useEffect } from 'react';

const TestUserData = () => {
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
  const [serverData, setServerData] = useState(null);

  useEffect(() => {
    // Récupérer les données du localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    setToken(storedToken);
    
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error("Erreur parsing user data:", error);
      }
    }

    // Récupérer les données du serveur
    if (storedToken) {
      fetchServerData(storedToken);
    }
  }, []);

  const fetchServerData = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServerData(data.user);
      } else {
        console.error("Erreur serveur:", response.status);
      }
    } catch (error) {
      console.error("Erreur fetch:", error);
    }
  };

  const getDisplayName = (user) => {
    if (!user) return "Non disponible";
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    if (user.username) {
      return user.username;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return "Nom non disponible";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔍 Test des Données Utilisateur</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Données localStorage */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">📱 Données localStorage</h2>
            
            <div className="space-y-3">
              <div>
                <strong>Token présent:</strong> 
                <span className={`ml-2 ${token ? 'text-green-600' : 'text-red-600'}`}>
                  {token ? '✅ Oui' : '❌ Non'}
                </span>
              </div>
              
              {token && (
                <div>
                  <strong>Token (début):</strong> 
                  <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                    {token.substring(0, 20)}...
                  </code>
                </div>
              )}
              
              {userData ? (
                <div className="space-y-2">
                  <div><strong>Nom d'affichage:</strong> {getDisplayName(userData)}</div>
                  <div><strong>Email:</strong> {userData.email}</div>
                  <div><strong>Username:</strong> {userData.username || 'Non défini'}</div>
                  <div><strong>Prénom:</strong> {userData.firstName || 'Non défini'}</div>
                  <div><strong>Nom:</strong> {userData.lastName || 'Non défini'}</div>
                  <div><strong>Rôle:</strong> {userData.role}</div>
                  <div><strong>ID:</strong> {userData.id}</div>
                </div>
              ) : (
                <div className="text-red-600">❌ Aucune donnée utilisateur trouvée</div>
              )}
            </div>
          </div>

          {/* Données serveur */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">🌐 Données Serveur</h2>
            
            {serverData ? (
              <div className="space-y-2">
                <div><strong>Nom d'affichage:</strong> {getDisplayName(serverData)}</div>
                <div><strong>Email:</strong> {serverData.email}</div>
                <div><strong>Username:</strong> {serverData.username || 'Non défini'}</div>
                <div><strong>Prénom:</strong> {serverData.firstName || 'Non défini'}</div>
                <div><strong>Nom:</strong> {serverData.lastName || 'Non défini'}</div>
                <div><strong>Rôle:</strong> {serverData.role}</div>
                <div><strong>ID:</strong> {serverData._id}</div>
                <div><strong>Créé le:</strong> {new Date(serverData.createdAt).toLocaleString()}</div>
              </div>
            ) : (
              <div className="text-orange-600">⏳ Chargement des données serveur...</div>
            )}
          </div>
        </div>

        {/* Comparaison */}
        {userData && serverData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">🔄 Comparaison</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Email identique:</span>
                <span className={userData.email === serverData.email ? 'text-green-600' : 'text-red-600'}>
                  {userData.email === serverData.email ? '✅' : '❌'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Rôle identique:</span>
                <span className={userData.role === serverData.role ? 'text-green-600' : 'text-red-600'}>
                  {userData.role === serverData.role ? '✅' : '❌'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Username identique:</span>
                <span className={userData.username === serverData.username ? 'text-green-600' : 'text-red-600'}>
                  {userData.username === serverData.username ? '✅' : '❌'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">🔧 Actions</h2>
          
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              🔄 Recharger
            </button>
            
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login';
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🚪 Déconnexion complète
            </button>
            
            <button
              onClick={() => window.location.href = '/accueil'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              🏠 Retour accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUserData;
