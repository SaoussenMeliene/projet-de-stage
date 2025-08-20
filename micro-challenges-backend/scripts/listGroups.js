require('dotenv').config();
const mongoose = require('mongoose');
const Group = require('../Models/Group');
const Challenge = require('../Models/Challenge');
const User = require('../Models/User');

async function listGroups() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Récupérer tous les groupes avec leurs détails
    const groups = await Group.find()
      .populate('challenge', 'title description category')
      .populate('members', 'username email')
      .sort({ createdAt: -1 });

    console.log(`\n📊 Total des groupes: ${groups.length}\n`);

    groups.forEach((group, index) => {
      console.log(`${index + 1}. ${group.name}`);
      console.log(`   - ID: ${group._id}`);
      console.log(`   - Défi: ${group.challenge?.title || 'Défi supprimé'}`);
      console.log(`   - Catégorie: ${group.challenge?.category || 'N/A'}`);
      console.log(`   - Membres: ${group.members.length}`);
      
      if (group.members.length > 0) {
        console.log(`   - Participants:`);
        group.members.forEach(member => {
          console.log(`     • ${member.username} (${member.email})`);
        });
      }
      
      console.log(`   - Créé le: ${group.createdAt.toLocaleDateString()}`);
      console.log(`   - Description: ${group.description || 'Aucune'}`);
      console.log('');
    });

    if (groups.length === 0) {
      console.log('ℹ️ Aucun groupe trouvé. Les groupes seront créés automatiquement quand des utilisateurs rejoindront des défis.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

listGroups();