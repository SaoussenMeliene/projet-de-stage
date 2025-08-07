const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
require('dotenv').config();

async function resetWassimPassword() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const email = 'wassim@satoripop.com';
    const newPassword = 'wassim123';

    console.log(`\n🔄 Réinitialisation du mot de passe pour: ${email}`);
    console.log(`🔑 Nouveau mot de passe: ${newPassword}`);

    // Rechercher l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('✅ Utilisateur trouvé');

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    console.log('🔐 Mot de passe hashé');

    // Mettre à jour le mot de passe
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    console.log('💾 Mot de passe mis à jour dans la base de données');

    // Vérifier que ça marche
    const updatedUser = await User.findOne({ email });
    const isMatch = await bcrypt.compare(newPassword, updatedUser.password);
    
    if (isMatch) {
      console.log('🎉 SUCCÈS ! Le mot de passe a été réinitialisé avec succès');
      console.log(`✅ Vous pouvez maintenant vous connecter avec:`);
      console.log(`   Email: ${email}`);
      console.log(`   Mot de passe: ${newPassword}`);
    } else {
      console.log('❌ Erreur lors de la vérification');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

resetWassimPassword();
