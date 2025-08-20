require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../Models/Challenge');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

async function testAPI() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Trouver un utilisateur et un défi
    const user = await User.findOne({ role: { $ne: 'admin' } }).limit(1);
    const challenge = await Challenge.findOne().limit(1);

    if (!user || !challenge) {
      console.log('❌ Utilisateur ou défi manquant');
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
    console.log(`🎫 Token généré`);

    // Simuler une requête API
    const axios = require('axios');
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/participants/join/${challenge._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Réponse API:', response.data);
      
      if (response.data.groupId) {
        console.log(`🎉 Utilisateur ajouté au groupe: ${response.data.groupId}`);
      }

    } catch (apiError) {
      if (apiError.response?.status === 200 && apiError.response?.data?.msg?.includes('déjà inscrit')) {
        console.log('ℹ️ Utilisateur déjà inscrit au défi');
      } else {
        console.error('❌ Erreur API:', apiError.response?.data || apiError.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testAPI();