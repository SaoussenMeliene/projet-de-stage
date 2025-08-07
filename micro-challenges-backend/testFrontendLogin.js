const axios = require('axios');

async function testFrontendLogin() {
  try {
    console.log('🌐 Test de connexion comme le frontend...');
    
    // Simuler exactement ce que fait LoginPagePro
    const loginData = {
      email: 'wassim@satoripop.com',
      password: 'wassim123',
      expectedRole: 'collaborateur' // Comme dans LoginPagePro
    };

    console.log('📧 Email:', loginData.email);
    console.log('🔑 Mot de passe:', loginData.password);
    console.log('👤 Rôle attendu:', loginData.expectedRole);
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

    // Simuler le stockage du token comme le frontend
    const token = response.data.token;
    console.log('💾 Token stocké (simulation):', token.substring(0, 50) + '...');

  } catch (error) {
    console.error('❌ ERREUR !');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📤 Réponse:', JSON.stringify(error.response.data, null, 2));
      console.error('📋 Headers:', error.response.headers);
    } else if (error.request) {
      console.error('🌐 Pas de réponse du serveur');
      console.error('📡 Request:', error.request);
    } else {
      console.error('⚙️  Erreur de configuration:', error.message);
    }
    console.error('🔍 Stack:', error.stack);
  }
}

// Test avec un nouvel utilisateur
async function testNewUserLogin() {
  try {
    console.log('\n🆕 Test avec un nouvel utilisateur...');
    
    const newUserData = {
      email: 'test@example.com',
      password: 'test123'
    };

    console.log('📧 Email:', newUserData.email);
    console.log('🔑 Mot de passe:', newUserData.password);

    const response = await axios.post('http://localhost:5000/api/auth/login', newUserData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log('✅ SUCCÈS !');
    console.log('📊 Status:', response.status);
    console.log('📤 Réponse:', JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error('❌ ERREUR (attendue) !');
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📤 Message:', error.response.data.msg);
    }
  }
}

async function runTests() {
  await testFrontendLogin();
  await testNewUserLogin();
}

runTests();
