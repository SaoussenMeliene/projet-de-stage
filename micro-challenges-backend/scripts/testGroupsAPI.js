require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testGroupsAPI() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver un utilisateur qui a des groupes
    const user = await User.findOne({ username: 'yasssin' });
    if (!user) {
      console.log('❌ Utilisateur yasssin non trouvé');
      return;
    }

    // Générer un token pour l'utilisateur
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`👤 Utilisateur: ${user.username} (${user._id})`);
    console.log(`🎫 Token généré`);

    // Tester l'API des groupes
    try {
      const response = await axios.get(
        'http://localhost:5000/api/groups/user',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Réponse API groups/user:');
      console.log(`📊 Nombre de groupes: ${response.data.length}`);
      
      response.data.forEach((group, index) => {
        console.log(`\n${index + 1}. ${group.name}`);
        console.log(`   - ID: ${group._id}`);
        console.log(`   - Défi: ${group.challenge?.title || 'N/A'}`);
        console.log(`   - Catégorie: ${group.challenge?.category || 'N/A'}`);
        console.log(`   - Membres: ${group.stats?.totalMembers || group.members?.length || 0}`);
        console.log(`   - Points totaux: ${group.stats?.totalPoints || 0}`);
        console.log(`   - Participants actifs: ${group.stats?.activeParticipants || 0}`);
      });

    } catch (apiError) {
      console.error('❌ Erreur API:', apiError.response?.data || apiError.message);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testGroupsAPI();