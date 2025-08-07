const axios = require('axios');

async function testWassimLogin() {
  try {
    console.log('🔍 Test de connexion pour Wassim...');
    
    const loginData = {
      email: 'wassim@satoripop.com',
      password: 'monpassword123',
      expectedRole: 'collaborateur'
    };
    
    console.log('📤 Envoi de la requête:', loginData);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Connexion réussie !');
    console.log('📥 Réponse du serveur:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur de connexion:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testWassimLogin();
