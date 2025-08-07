const mongoose = require('mongoose');
const User = require('./Models/User');
require('dotenv').config();

async function checkAdminUsers() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Rechercher tous les utilisateurs admin
    const adminUsers = await User.find({ role: 'admin' });
    
    console.log('\n👑 UTILISATEURS ADMINISTRATEURS TROUVÉS:');
    console.log('==========================================');
    
    if (adminUsers.length === 0) {
      console.log('❌ Aucun utilisateur administrateur trouvé !');
    } else {
      adminUsers.forEach((admin, index) => {
        console.log(`\n${index + 1}. 👤 ${admin.username}`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   🆔 ID: ${admin._id}`);
        console.log(`   👑 Rôle: ${admin.role}`);
        console.log(`   📅 Créé le: ${admin.createdAt || 'Date inconnue'}`);
        console.log(`   🔑 Mot de passe hashé: ${admin.password ? 'Oui' : 'Non'}`);
      });
    }

    // Rechercher aussi les utilisateurs avec des emails admin
    console.log('\n🔍 RECHERCHE D\'EMAILS ADMINISTRATEURS:');
    console.log('=====================================');
    
    const adminEmails = [
      'admin@satoripop.com',
      'directeur@satoripop.com',
      'manager@satoripop.com',
      'direction@satoripop.com',
      'chef@satoripop.com'
    ];

    for (const email of adminEmails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ ${email} - Rôle: ${user.role} - Username: ${user.username}`);
      } else {
        console.log(`❌ ${email} - Non trouvé`);
      }
    }

    // Afficher tous les utilisateurs pour référence
    console.log('\n📋 TOUS LES UTILISATEURS:');
    console.log('========================');
    
    const allUsers = await User.find({}, 'email username role');
    allUsers.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : user.role === 'manager' ? '👔' : '👤';
      console.log(`${index + 1}. ${roleIcon} ${user.email} (${user.username}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

checkAdminUsers();
