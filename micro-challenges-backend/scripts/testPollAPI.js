const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testPollAPI() {
  console.log('🧪 Test de l\'API des sondages\n');

  try {
    // 1. Test de connexion admin
    console.log('1️⃣ Connexion admin...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@satoripop.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Connexion réussie');

    // 2. Test récupération des groupes
    console.log('\n2️⃣ Récupération des groupes...');
    const groupsResponse = await axios.get(`${BASE_URL}/groups/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const groups = groupsResponse.data;
    console.log(`✅ ${groups.length} groupes trouvés`);
    
    if (groups.length === 0) {
      console.log('❌ Aucun groupe disponible pour le test');
      return;
    }

    const groupId = groups[0]._id;
    console.log(`📍 Test avec le groupe: ${groups[0].name} (${groupId})`);

    // 3. Test récupération des sondages du groupe
    console.log('\n3️⃣ Test récupération sondages du groupe...');
    try {
      const pollsResponse = await axios.get(`${BASE_URL}/polls/group/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Sondages récupérés avec succès:');
      console.log('Response data:', JSON.stringify(pollsResponse.data, null, 2));
      
    } catch (pollError) {
      console.log('❌ Erreur récupération sondages:');
      console.log('Status:', pollError.response?.status);
      console.log('Data:', pollError.response?.data);
      console.log('Message:', pollError.message);
    }

    // 4. Test création d'un sondage
    console.log('\n4️⃣ Test création d\'un sondage...');
    try {
      const newPollResponse = await axios.post(`${BASE_URL}/polls/group/${groupId}`, {
        question: "Test: Quelle est votre couleur préférée ?",
        options: ["Rouge", "Bleu", "Vert", "Jaune"]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Sondage créé avec succès:');
      console.log('Poll ID:', newPollResponse.data.poll._id);
      
    } catch (createError) {
      console.log('❌ Erreur création sondage:');
      console.log('Status:', createError.response?.status);
      console.log('Data:', createError.response?.data);
      console.log('Message:', createError.message);
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Exécuter le test
testPollAPI();