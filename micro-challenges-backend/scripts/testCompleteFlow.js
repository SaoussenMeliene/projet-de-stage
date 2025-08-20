require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');
const Challenge = require('../Models/Challenge');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testCompleteFlow() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver un utilisateur et un défi
    const user = await User.findOne({ username: 'leila' });
    const challenge = await Challenge.findOne({ title: { $regex: 'vélo', $options: 'i' } });

    if (!user || !challenge) {
      console.log('❌ Utilisateur ou défi manquant');
      console.log('Utilisateur:', user?.username);
      console.log('Défi:', challenge?.title);
      return;
    }

    // Générer un token pour l'utilisateur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`👤 Utilisateur: ${user.username}`);
    console.log(`📋 Défi: ${challenge.title}`);
    console.log(`🎫 Token généré\n`);

    // Étape 1: Rejoindre le défi
    console.log('🎯 ÉTAPE 1: Rejoindre le défi...');
    try {
      const joinResponse = await axios.post(
        `http://localhost:5000/api/participants/join/${challenge._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Défi rejoint:', joinResponse.data.msg);
      if (joinResponse.data.groupId) {
        console.log(`🎉 Ajouté au groupe: ${joinResponse.data.groupId}`);
        console.log(`📝 Nom du groupe: ${joinResponse.data.groupName || 'N/A'}`);
      }

    } catch (joinError) {
      if (joinError.response?.status === 200) {
        console.log('ℹ️ Déjà inscrit au défi');
      } else {
        console.error('❌ Erreur lors de l\'inscription:', joinError.response?.data || joinError.message);
      }
    }

    console.log('\n🔍 ÉTAPE 2: Récupérer les groupes de l\'utilisateur...');
    
    // Étape 2: Récupérer les groupes
    try {
      const groupsResponse = await axios.get(
        'http://localhost:5000/api/groups/user',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`✅ Groupes récupérés: ${groupsResponse.data.length} groupe(s)`);
      
      groupsResponse.data.forEach((group, index) => {
        console.log(`\n📋 Groupe ${index + 1}:`);
        console.log(`   - Nom: ${group.name}`);
        console.log(`   - Défi: ${group.challenge?.title || 'N/A'}`);
        console.log(`   - Catégorie: ${group.challenge?.category || 'N/A'}`);
        console.log(`   - Membres: ${group.stats?.totalMembers || 0}`);
        console.log(`   - Points: ${group.stats?.totalPoints || 0}`);
        console.log(`   - Participants actifs: ${group.stats?.activeParticipants || 0}`);
      });

      console.log('\n🎉 FLUX COMPLET TESTÉ AVEC SUCCÈS !');
      console.log('✅ L\'utilisateur peut maintenant voir ses groupes dans l\'interface "Mon Groupe"');

    } catch (groupsError) {
      console.error('❌ Erreur lors de la récupération des groupes:', groupsError.response?.data || groupsError.message);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnecté de MongoDB');
  }
}

testCompleteFlow();