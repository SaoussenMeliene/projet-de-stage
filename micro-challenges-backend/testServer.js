const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test simple
app.get('/', (req, res) => {
  res.json({ message: '🚀 Serveur de test opérationnel' });
});

// Route de test pour login
app.post('/api/auth/login', (req, res) => {
  console.log('📥 Requête de login reçue:', req.body);
  
  const { email, password } = req.body;
  
  // Test simple sans base de données
  if (email === 'marie.dupont@satoripop.com' && password === 'marie123') {
    res.json({
      token: 'test-token-123',
      user: {
        id: '123',
        email: 'marie.dupont@satoripop.com',
        username: 'marie_dupont',
        role: 'collaborateur',
        firstName: 'Marie',
        lastName: 'Dupont'
      },
      message: 'Connexion réussie en tant que collaborateur'
    });
  } else if (email === 'admin@satoripop.com' && password === 'admin123') {
    res.json({
      token: 'test-token-admin',
      user: {
        id: '456',
        email: 'admin@satoripop.com',
        username: 'admin',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'System'
      },
      message: 'Connexion réussie en tant que admin'
    });
  } else {
    res.status(400).json({ msg: 'Email ou mot de passe incorrect.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur de test lancé sur http://localhost:${PORT}`);
  console.log('📋 Credentials de test:');
  console.log('- marie.dupont@satoripop.com / marie123 (collaborateur)');
  console.log('- admin@satoripop.com / admin123 (admin)');
});
