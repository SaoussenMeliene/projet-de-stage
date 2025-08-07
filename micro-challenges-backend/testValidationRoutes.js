const axios = require('axios');

async function testValidationRoutes() {
  console.log('🧪 TEST DES ROUTES DE VALIDATION');
  console.log('===============================\n');

  const baseUrl = 'http://localhost:5000/api/auth';

  try {
    // Test 1: Vérification d'un nom d'utilisateur disponible
    console.log('1️⃣ Test nom d\'utilisateur disponible...');
    try {
      const response1 = await axios.get(`${baseUrl}/check-username/nouveauuser123`);
      console.log('✅ Réponse:', response1.data);
    } catch (error) {
      console.log('❌ Erreur:', error.response?.data || error.message);
    }

    // Test 2: Vérification d'un nom d'utilisateur existant
    console.log('\n2️⃣ Test nom d\'utilisateur existant...');
    try {
      const response2 = await axios.get(`${baseUrl}/check-username/wassim`);
      console.log('✅ Réponse:', response2.data);
    } catch (error) {
      console.log('❌ Erreur (attendue):', error.response?.data || error.message);
    }

    // Test 3: Vérification d'un email disponible
    console.log('\n3️⃣ Test email disponible...');
    try {
      const response3 = await axios.get(`${baseUrl}/check-email/nouveautest@satoripop.com`);
      console.log('✅ Réponse:', response3.data);
    } catch (error) {
      console.log('❌ Erreur:', error.response?.data || error.message);
    }

    // Test 4: Vérification d'un email existant
    console.log('\n4️⃣ Test email existant...');
    try {
      const response4 = await axios.get(`${baseUrl}/check-email/wassim@satoripop.com`);
      console.log('✅ Réponse:', response4.data);
    } catch (error) {
      console.log('❌ Erreur (attendue):', error.response?.data || error.message);
    }

    // Test 5: Validation avec nom d'utilisateur trop court
    console.log('\n5️⃣ Test nom d\'utilisateur trop court...');
    try {
      const response5 = await axios.get(`${baseUrl}/check-username/ab`);
      console.log('✅ Réponse:', response5.data);
    } catch (error) {
      console.log('❌ Erreur (attendue):', error.response?.data || error.message);
    }

    // Test 6: Validation avec email invalide
    console.log('\n6️⃣ Test email invalide...');
    try {
      const response6 = await axios.get(`${baseUrl}/check-email/emailinvalide`);
      console.log('✅ Réponse:', response6.data);
    } catch (error) {
      console.log('❌ Erreur (attendue):', error.response?.data || error.message);
    }

    console.log('\n🎉 TESTS TERMINÉS !');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testValidationRoutes();
