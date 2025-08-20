require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testProofAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    const user = await User.findOne({ username: 'leila' });
    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log('🎫 Token généré pour:', user.username);

    // Test simple: obtenir mes preuves
    console.log('\n🔍 Test: Obtenir mes preuves...');
    try {
      const response = await axios.get('http://localhost:5000/api/proofs/my-proofs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ API preuves accessible');
      console.log(`📊 Nombre de preuves: ${response.data.count}`);

    } catch (error) {
      console.error('❌ Erreur API:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  }
}

testProofAPI();