const axios = require('axios');

async function testPasswordReset() {
  console.log('🧪 TEST COMPLET DE RÉINITIALISATION DE MOT DE PASSE');
  console.log('================================================\n');

  const testEmail = 'wassim@satoripop.com';

  try {
    // Étape 1: Demande de réinitialisation
    console.log('1️⃣ Test de demande de réinitialisation...');
    const forgotResponse = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: testEmail
    });

    console.log('✅ Demande réussie');
    console.log('📤 Réponse:', forgotResponse.data);
    
    const resetToken = forgotResponse.data.resetToken;
    if (!resetToken) {
      console.log('❌ Token non reçu');
      return;
    }

    console.log('🔑 Token reçu:', resetToken);

    // Étape 2: Réinitialisation du mot de passe
    console.log('\n2️⃣ Test de réinitialisation...');
    const newPassword = 'nouveauMotDePasse123';
    
    const resetResponse = await axios.post('http://localhost:5000/api/auth/reset-password', {
      token: resetToken,
      newPassword: newPassword
    });

    console.log('✅ Réinitialisation réussie');
    console.log('📤 Réponse:', resetResponse.data);

    // Étape 3: Test de connexion avec le nouveau mot de passe
    console.log('\n3️⃣ Test de connexion avec le nouveau mot de passe...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: testEmail,
      password: newPassword
    });

    console.log('✅ Connexion réussie avec le nouveau mot de passe');
    console.log('👤 Utilisateur:', loginResponse.data.user.email);

    // Étape 4: Remettre l'ancien mot de passe
    console.log('\n4️⃣ Remise de l\'ancien mot de passe...');
    const restoreResponse = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: testEmail
    });

    const restoreToken = restoreResponse.data.resetToken;
    await axios.post('http://localhost:5000/api/auth/reset-password', {
      token: restoreToken,
      newPassword: 'wassim123' // Ancien mot de passe
    });

    console.log('✅ Ancien mot de passe restauré');

    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testPasswordReset();
