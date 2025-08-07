const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./Models/User');
require('dotenv').config();

async function testLogin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'wassim@satoripop.com';
    const password = 'wassim123'; // Le mot de passe que vous utilisez

    console.log(`\n🔍 Test de connexion pour: ${email}`);
    console.log(`🔑 Mot de passe testé: ${password}`);

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé');

    // Tester le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`🔐 Mot de passe correct: ${isMatch ? 'OUI' : 'NON'}`);

    if (isMatch) {
      // Générer le token
      const token = jwt.sign(
        { id: user._id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      console.log('🎉 CONNEXION RÉUSSIE !');
      console.log('📋 Données utilisateur:');
      console.log('- ID:', user._id);
      console.log('- Username:', user.username);
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('🔑 Token généré:', token.substring(0, 50) + '...');
    } else {
      console.log('❌ ÉCHEC DE CONNEXION - Mot de passe incorrect');
      
      // Test avec d'autres mots de passe possibles
      const testPasswords = ['123456', 'password', 'wassim', 'admin', 'test'];
      console.log('\n🔍 Test avec d\'autres mots de passe...');
      
      for (const testPwd of testPasswords) {
        const testMatch = await bcrypt.compare(testPwd, user.password);
        if (testMatch) {
          console.log(`✅ TROUVÉ ! Le bon mot de passe est: ${testPwd}`);
          break;
        }
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

testLogin();
