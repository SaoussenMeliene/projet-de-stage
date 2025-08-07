const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🌐 Test de l\'API de connexion...');
    
    const loginData = {
      email: 'wassim@satoripop.com',
      password: 'wassim123'
    };

    console.log('📧 Email:', loginData.email);
    console.log('🔑 Mot de passe:', loginData.password);
    console.log('🎯 URL:', 'http://localhost:5000/api/auth/login');

    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log('✅ SUCCÈS !');
    console.log('📊 Status:', response.status);
    console.log('📤 Réponse:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ ERREUR !');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📤 Réponse:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('🌐 Pas de réponse du serveur');
      console.error('📡 Request:', error.request);
    } else {
      console.error('⚙️  Erreur de configuration:', error.message);
    }
  }
}

testLoginAPI();
