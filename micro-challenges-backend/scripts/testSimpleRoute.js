const axios = require('axios');

async function testSimpleRoute() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log('✅ Route racine:', response.data);
  } catch (error) {
    console.error('❌ Erreur route racine:', error.message);
  }

  try {
    const response = await axios.get('http://localhost:5000/api/challenges');
    console.log('✅ Route challenges:', response.data.length, 'défis');
  } catch (error) {
    console.error('❌ Erreur route challenges:', error.response?.status);
  }
}

testSimpleRoute();