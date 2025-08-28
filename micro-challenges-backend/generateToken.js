require('dotenv').config();
const jwt = require('jsonwebtoken');

// Générer un token valide pour les tests
const userId = '6877cced971f745e6dc0d7e3';
const email = 'wassim@satoripop.com';

const token = jwt.sign(
  { 
    userId: userId, 
    role: 'user',
    email: email 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' } // Token valide 24h
);

console.log('🔐 Token généré (valide 24h):');
console.log(token);
console.log('');
console.log('👤 Données utilisateur:');
console.log('- ID:', userId);
console.log('- Email:', email);
console.log('- Role: user');