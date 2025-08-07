const mongoose = require('mongoose');
const User = require('./Models/User');
require('dotenv').config();

async function testUserExists() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Rechercher l'utilisateur wassim@satoripop.com
    const user = await User.findOne({ email: 'wassim@satoripop.com' });
    
    if (user) {
      console.log('✅ Utilisateur trouvé:');
      console.log('- Email:', user.email);
      console.log('- Username:', user.username);
      console.log('- Role:', user.role);
      console.log('- ID:', user._id);
      console.log('- Mot de passe hashé:', user.password ? 'Oui' : 'Non');
    } else {
      console.log('❌ Utilisateur wassim@satoripop.com NON TROUVÉ');
      
      // Lister tous les utilisateurs pour debug
      const allUsers = await User.find({}, 'email username role');
      console.log('\n📋 Tous les utilisateurs dans la base:');
      allUsers.forEach((u, index) => {
        console.log(`${index + 1}. ${u.email} (${u.username}) - ${u.role}`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

testUserExists();
