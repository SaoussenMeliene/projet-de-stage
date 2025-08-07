const axios = require('axios');

async function debugLogin() {
  console.log('🔍 DIAGNOSTIC COMPLET DE CONNEXION');
  console.log('=====================================\n');

  // Test 1: Vérifier si le serveur backend répond
  console.log('1️⃣ Test de connectivité du serveur backend...');
  try {
    const healthCheck = await axios.get('http://localhost:5000/', { timeout: 3000 });
    console.log('✅ Serveur backend accessible');
    console.log('📤 Réponse:', healthCheck.data);
  } catch (error) {
    console.log('❌ Serveur backend inaccessible !');
    console.log('🔍 Erreur:', error.message);
    return;
  }

  // Test 2: Test de connexion avec les bonnes données
  console.log('\n2️⃣ Test de connexion avec wassim@satoripop.com...');
  try {
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'wassim@satoripop.com',
      password: 'wassim123'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    console.log('✅ Connexion réussie !');
    console.log('📊 Status:', loginResponse.status);
    console.log('🎫 Token reçu:', loginResponse.data.token ? 'OUI' : 'NON');
    console.log('👤 Utilisateur:', loginResponse.data.user?.email);

  } catch (error) {
    console.log('❌ Échec de connexion !');
    
    if (error.response) {
      console.log('📊 Status HTTP:', error.response.status);
      console.log('📤 Message d\'erreur:', error.response.data?.msg || error.response.data);
      console.log('📋 Headers de réponse:', error.response.headers);
    } else if (error.request) {
      console.log('🌐 Aucune réponse du serveur');
      console.log('📡 Détails de la requête:', error.request);
    } else {
      console.log('⚙️ Erreur de configuration:', error.message);
    }
  }

  // Test 3: Test avec de mauvaises données
  console.log('\n3️⃣ Test avec de mauvaises données (pour vérifier que l\'API fonctionne)...');
  try {
    await axios.post('http://localhost:5000/api/auth/login', {
      email: 'inexistant@test.com',
      password: 'mauvais'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000
    });

    console.log('⚠️ Connexion réussie avec de mauvaises données (problème !)');

  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ API rejette correctement les mauvaises données');
      console.log('📤 Message:', error.response.data?.msg);
    } else {
      console.log('❌ Erreur inattendue:', error.message);
    }
  }

  // Test 4: Test CORS
  console.log('\n4️⃣ Test CORS depuis le frontend...');
  try {
    const corsTest = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'wassim@satoripop.com',
      password: 'wassim123'
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'  // Simuler l'origine du frontend
      },
      timeout: 5000
    });

    console.log('✅ CORS fonctionne correctement');

  } catch (error) {
    if (error.response) {
      console.log('❌ Problème CORS possible');
      console.log('📊 Status:', error.response.status);
      console.log('📤 Message:', error.response.data?.msg);
    } else {
      console.log('❌ Erreur CORS:', error.message);
    }
  }

  console.log('\n🎯 DIAGNOSTIC TERMINÉ');
  console.log('=====================================');
}

debugLogin();
