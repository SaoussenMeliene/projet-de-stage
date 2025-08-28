// Fonction pour se connecter rapidement en développement
export const quickLogin = () => {
  // Token de test généré avec les bonnes informations utilisateur  
  const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODc3Y2NlZDk3MWY3NDVlNmRjMGQ3ZTMiLCJyb2xlIjoidXNlciIsImlhdCI6MTcyNDgyNjA4MiwiZXhwIjoxNzI0ODI5NjgyLCJlbWFpbCI6Indhc3NpbUBzYXRvcmlwb3AuY29tIn0";
  
  const userData = {
    userId: "6877cced971f745e6dc0d7e3",
    email: "wassim@satoripop.com",
    role: "user"
  };
  
  // Sauvegarder le token et les données
  localStorage.setItem('token', testToken);
  localStorage.setItem('user', JSON.stringify(userData));
  
  console.log('🔐 Connexion rapide effectuée pour:', userData.email);
  
  // Rafraîchir la page pour appliquer la connexion
  window.location.reload();
};

// Fonction pour se déconnecter
export const quickLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.reload();
};

// Exposer globalement en dev
if (import.meta.env.MODE === 'development') {
  window.quickLogin = quickLogin;
  window.quickLogout = quickLogout;
}