const axios = require('axios');

async function testRoutes() {
  console.log('🔍 Test des routes disponibles...\n');

  const routes = [
    'http://localhost:5000/',
    'http://localhost:5000/api/challenges',
    'http://localhost:5000/api/users',
    'http://localhost:5000/api/proofs'
  ];

  for (const route of routes) {
    try {
      const response = await axios.get(route);
      console.log(`✅ ${route} - Status: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${route} - Status: ${error.response?.status || 'ERROR'} - ${error.response?.statusText || error.message}`);
    }
  }
}

testRoutes();