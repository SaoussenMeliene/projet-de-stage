const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🔍 Test de l\'API de login...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'marie.dupont@satoripop.com',
      password: 'marie123',
      expectedRole: 'collaborateur'
    });
    
    console.log('✅ Réponse de l\'API:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur API:', error.response?.data || error.message);
  }
}

testLoginAPI();
