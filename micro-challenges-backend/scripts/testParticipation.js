require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../Models/Challenge');
const Participant = require('../Models/Participant');
const Group = require('../Models/Group');
const User = require('../Models/User');

async function testParticipation() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver un défi existant
    const challenge = await Challenge.findOne().limit(1);
    if (!challenge) {
      console.log('❌ Aucun défi trouvé');
      return;
    }

    console.log(`📋 Défi trouvé: "${challenge.title}" (ID: ${challenge._id})`);

    // Trouver un utilisateur
    const user = await User.findOne({ role: { $ne: 'admin' } }).limit(1);
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }

    console.log(`👤 Utilisateur trouvé: "${user.username}" (ID: ${user._id})`);

    // Vérifier s'il y a déjà une participation
    let participant = await Participant.findOne({ 
      user: user._id, 
      challenge: challenge._id 
    });

    if (participant) {
      console.log('ℹ️ Participation existante trouvée');
    } else {
      // Créer une participation
      console.log('📝 Création d\'une nouvelle participation...');
      participant = await Participant.create({
        user: user._id,
        challenge: challenge._id,
        status: 'confirmé'
      });
      console.log('✅ Participation créée');
    }

    // Vérifier le groupe
    let group = await Group.findOne({ challenge: challenge._id });
    
    if (!group) {
      console.log('📝 Création d\'un nouveau groupe...');
      group = await Group.create({
        name: `Groupe du défi : ${challenge.title}`,
        challenge: challenge._id,
        members: [user._id],
        description: `Groupe de discussion pour le défi "${challenge.title}"`
      });
      console.log(`✅ Groupe créé: "${group.name}" (ID: ${group._id})`);
    } else {
      const isMember = group.members.some(memberId => memberId.toString() === user._id.toString());
      if (!isMember) {
        console.log('👥 Ajout de l\'utilisateur au groupe existant...');
        group.members.push(user._id);
        await group.save();
        console.log('✅ Utilisateur ajouté au groupe');
      } else {
        console.log('ℹ️ L\'utilisateur est déjà membre du groupe');
      }
    }

    // Afficher les statistiques finales
    const totalParticipants = await Participant.countDocuments({ challenge: challenge._id });
    const totalMembers = group.members.length;

    console.log('\n📊 Statistiques finales:');
    console.log(`   - Participants au défi: ${totalParticipants}`);
    console.log(`   - Membres du groupe: ${totalMembers}`);
    console.log(`   - Nom du groupe: "${group.name}"`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testParticipation();