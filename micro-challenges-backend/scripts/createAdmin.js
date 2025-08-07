const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer un mot de passe hashé
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        username: 'admin',
        email: 'admin@satoripop.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('🎉 Compte administrateur créé !');
    } else {
      console.log('⚠️  Administrateur existe déjà');
    }

    // Vérifier si un collaborateur de test existe déjà
    const existingUser = await User.findOne({ email: 'user@satoripop.com' });
    if (!existingUser) {
      const user = new User({
        username: 'collaborateur',
        email: 'user@satoripop.com',
        password: hashedPassword,
        role: 'collaborateur'
      });
      await user.save();
      console.log('👤 Compte collaborateur créé !');
    } else {
      console.log('⚠️  Collaborateur existe déjà');
    }

    console.log('');
    console.log('🎯 COMPTES DE DÉMONSTRATION DISPONIBLES :');
    console.log('');
    console.log('🛡️  ADMINISTRATEUR :');
    console.log('   📧 Email: admin@satoripop.com');
    console.log('   🔑 Mot de passe: admin123');
    console.log('   🔐 Rôle: admin');
    console.log('');
    console.log('👤 COLLABORATEUR :');
    console.log('   📧 Email: user@satoripop.com');
    console.log('   🔑 Mot de passe: admin123');
    console.log('   🔐 Rôle: collaborateur');
    console.log('');
    console.log('🚀 Vous pouvez maintenant vous connecter avec ces identifiants');

  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
    process.exit(0);
  }
};

createAdmin();
