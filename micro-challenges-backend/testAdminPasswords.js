const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
require('dotenv').config();

async function testAdminPasswords() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const adminEmails = [
      'admin@satoripop.com',
      'directeur@satoripop.com', 
      'manager@satoripop.com'
    ];

    // Mots de passe courants à tester
    const commonPasswords = [
      'admin',
      'admin123',
      'password',
      '123456',
      'satoripop',
      'directeur',
      'manager',
      'directeur123',
      'manager123',
      'admin2024',
      'admin2025'
    ];

    console.log('\n🔍 TEST DES MOTS DE PASSE COURANTS:');
    console.log('==================================');

    for (const email of adminEmails) {
      console.log(`\n👑 Test pour ${email}:`);
      
      const user = await User.findOne({ email });
      if (!user) {
        console.log('❌ Utilisateur non trouvé');
        continue;
      }

      let passwordFound = false;

      for (const password of commonPasswords) {
        try {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            console.log(`✅ MOT DE PASSE TROUVÉ: "${password}"`);
            passwordFound = true;
            break;
          }
        } catch (error) {
          console.log(`❌ Erreur test "${password}":`, error.message);
        }
      }

      if (!passwordFound) {
        console.log('❌ Aucun mot de passe courant ne fonctionne');
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

testAdminPasswords();
