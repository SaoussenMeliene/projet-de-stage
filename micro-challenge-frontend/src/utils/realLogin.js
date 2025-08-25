// Script pour tester la connexion réelle avec l'API
export const testRealLogin = async (email, password) => {
  console.log('🔐 Test de connexion réelle avec:', email);
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Connexion réussie:', data);
      
      // Sauvegarder les vraies données
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('lastTokenUsed', data.token);
      localStorage.setItem('rememberMe', 'true');
      
      console.log('✅ Données utilisateur sauvegardées:', {
        nom: `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        email: data.user.email,
        rôle: data.user.role,
        id: data.user.id
      });
      
      return { success: true, user: data.user, token: data.token };
    } else {
      const error = await response.json();
      console.error('❌ Échec de la connexion:', error);
      return { success: false, error: error.msg };
    }
  } catch (error) {
    console.error('❌ Erreur réseau:', error);
    return { success: false, error: error.message };
  }
};

// Test avec admin par défaut
export const testAdminLogin = () => {
  return testRealLogin('admin@satoripop.com', 'admin123');
};

// Fonction pour vérifier les données actuelles
export const checkUserData = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  
  console.log('📊 Données utilisateur actuelles:', {
    connecté: !!token,
    email: user.email || 'Non défini',
    nom: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Non défini',
    rôle: user.role || 'Non défini',
    id: user.id || 'Non défini'
  });
  
  return { user, token, isConnected: !!token };
};

// Rendre les fonctions disponibles globalement
if (typeof window !== 'undefined') {
  window.testRealLogin = testRealLogin;
  window.testAdminLogin = testAdminLogin;
  window.checkUserData = checkUserData;
}
