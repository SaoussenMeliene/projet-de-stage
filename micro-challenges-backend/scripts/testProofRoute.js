const axios = require('axios');

async function testProofRoute() {
  try {
    const response = await axios.get('http://localhost:5000/api/proofs/test');
    console.log('✅ Route proof test:', response.data);
  } catch (error) {
    console.error('❌ Erreur route proof test:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testProofRoute();