const axios = require('axios');

async function testWithLogs() {
  console.log('🔍 Test avec logs détaillés...');
  
  try {
    console.log('Tentative de connexion à http://localhost:5000/api/proofs/test');
    const response = await axios.get('http://localhost:5000/api/proofs/test', {
      timeout: 5000
    });
    console.log('✅ Succès:', response.data);
  } catch (error) {
    console.error('❌ Erreur détaillée:');
    console.error('- Status:', error.response?.status);
    console.error('- StatusText:', error.response?.statusText);
    console.error('- Headers:', error.response?.headers);
    console.error('- Data:', error.response?.data);
    console.error('- Message:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🚨 Le serveur ne répond pas sur le port 5000');
    }
  }
}

testWithLogs();