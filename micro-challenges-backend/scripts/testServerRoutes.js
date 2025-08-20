const axios = require('axios');

async function testServerRoutes() {
  console.log('🔍 Test des routes du serveur...\n');

  const routes = [
    { url: 'http://localhost:5000/', name: 'Racine' },
    { url: 'http://localhost:5000/api/challenges', name: 'Challenges' },
    { url: 'http://localhost:5000/api/proofs/test', name: 'Proof Test' },
  ];

  for (const route of routes) {
    try {
      const response = await axios.get(route.url, { timeout: 3000 });
      console.log(`✅ ${route.name}: ${response.status} - ${typeof response.data === 'string' ? response.data.substring(0, 50) : 'OK'}`);
    } catch (error) {
      console.log(`❌ ${route.name}: ${error.response?.status || 'ERROR'} - ${error.response?.statusText || error.message}`);
    }
  }
}

testServerRoutes();