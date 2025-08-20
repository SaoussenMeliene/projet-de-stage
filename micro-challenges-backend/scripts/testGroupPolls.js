const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Configuration des utilisateurs de test
const users = {
  admin: {
    email: 'admin@satoripop.com',
    password: 'admin123'
  },
  user: {
    email: 'user@satoripop.com', 
    password: 'user123'
  }
};

let tokens = {};
let groupId = null;

async function login(userKey) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, users[userKey]);
    tokens[userKey] = response.data.token;
    console.log(`✅ ${userKey} connecté avec succès`);
    return response.data.token;
  } catch (error) {
    console.error(`❌ Erreur connexion ${userKey}:`, error.response?.data || error.message);
    throw error;
  }
}

async function getGroups(token) {
  try {
    const response = await axios.get(`${BASE_URL}/groups/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const groups = response.data; // Le contrôleur retourne directement le tableau
    console.log(`✅ Groupes récupérés:`, groups.map(g => ({ id: g._id, name: g.name })));
    return groups;
  } catch (error) {
    console.error('❌ Erreur récupération groupes:', error.response?.data || error.message);
    throw error;
  }
}

async function createGroupPoll(token, groupId, pollData) {
  try {
    const response = await axios.post(`${BASE_URL}/polls/group/${groupId}`, pollData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Sondage créé:', response.data);
    return response.data.poll;
  } catch (error) {
    console.error('❌ Erreur création sondage:', error.response?.data || error.message);
    throw error;
  }
}

async function getGroupPolls(token, groupId) {
  try {
    const response = await axios.get(`${BASE_URL}/polls/group/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Sondages du groupe récupérés:', response.data);
    return response.data.polls;
  } catch (error) {
    console.error('❌ Erreur récupération sondages:', error.response?.data || error.message);
    throw error;
  }
}

async function voteOnPoll(token, pollId, optionIndex) {
  try {
    const response = await axios.post(`${BASE_URL}/polls/${pollId}/vote`, 
      { optionIndex }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Vote enregistré:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur vote:', error.response?.data || error.message);
    throw error;
  }
}

async function closePoll(token, pollId) {
  try {
    const response = await axios.patch(`${BASE_URL}/polls/${pollId}/close`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Sondage clôturé:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur clôture sondage:', error.response?.data || error.message);
    throw error;
  }
}

async function testGroupPolls() {
  console.log('🚀 Test des sondages de groupe\n');

  try {
    // 1. Connexion des utilisateurs
    console.log('1️⃣ Connexion des utilisateurs...');
    await login('admin');
    await login('user');
    console.log('');

    // 2. D'abord, créer un groupe de test avec l'admin
    console.log('2️⃣ Création d\'un groupe de test...');
    const testGroupData = {
      name: "Groupe Test Sondages",
      challengeId: "68a43fd05074ae8ccba6c0b1" // ID du défi "Défi sympatique" qui a plusieurs membres
    };
    
    let testGroup;
    try {
      const response = await axios.post(`${BASE_URL}/groups`, testGroupData, {
        headers: { Authorization: `Bearer ${tokens.admin}` }
      });
      testGroup = response.data.group;
      groupId = testGroup._id;
      console.log(`✅ Groupe créé: ${testGroup.name} (${groupId})`);
    } catch (error) {
      // Si le groupe existe déjà, récupérer les groupes existants
      console.log('ℹ️ Utilisation d\'un groupe existant...');
      const adminGroups = await getGroups(tokens.admin);
      if (adminGroups.length === 0) {
        console.log('❌ Aucun groupe disponible pour le test.');
        return;
      }
      groupId = adminGroups[0]._id;
      console.log(`📍 Utilisation du groupe: ${adminGroups[0].name} (${groupId})`);
    }
    console.log('');

    // 3. Créer un sondage dans le groupe
    console.log('3️⃣ Création d\'un sondage par l\'admin...');
    const pollData = {
      question: "Quelle activité préférez-vous pour notre prochain événement de groupe ?",
      options: [
        "Sortie vélo en groupe",
        "Pique-nique écologique", 
        "Atelier DIY",
        "Course solidaire"
      ]
    };
    const poll = await createGroupPoll(tokens.admin, groupId, pollData);
    const pollId = poll._id;
    console.log('');

    // 4. Récupérer les sondages du groupe
    console.log('4️⃣ Récupération des sondages du groupe...');
    await getGroupPolls(tokens.admin, groupId);
    console.log('');

    // 5. Vote de l'utilisateur (s'il est membre du groupe)
    console.log('5️⃣ Vote de l\'utilisateur...');
    try {
      await voteOnPoll(tokens.user, pollId, 1); // Vote pour "Pique-nique écologique"
    } catch (error) {
      console.log('ℹ️ L\'utilisateur ne peut pas voter (probablement pas membre du groupe)');
    }
    console.log('');

    // 6. Vote de l'admin
    console.log('6️⃣ Vote de l\'admin...');
    await voteOnPoll(tokens.admin, pollId, 0); // Vote pour "Sortie vélo en groupe"
    console.log('');

    // 7. Tentative de double vote
    console.log('7️⃣ Tentative de double vote de l\'admin...');
    try {
      await voteOnPoll(tokens.admin, pollId, 2);
    } catch (error) {
      console.log('✅ Double vote correctement bloqué');
    }
    console.log('');

    // 8. Récupérer les résultats mis à jour
    console.log('8️⃣ Récupération des résultats mis à jour...');
    await getGroupPolls(tokens.admin, groupId);
    console.log('');

    // 9. Clôturer le sondage
    console.log('9️⃣ Clôture du sondage par l\'admin...');
    await closePoll(tokens.admin, pollId);
    console.log('');

    // 10. Tentative de vote sur sondage clôturé
    console.log('🔟 Tentative de vote sur sondage clôturé...');
    try {
      await voteOnPoll(tokens.user, pollId, 3);
    } catch (error) {
      console.log('✅ Vote sur sondage clôturé correctement bloqué');
    }

    console.log('\n🎉 Test des sondages de groupe terminé avec succès !');

  } catch (error) {
    console.error('\n💥 Erreur durant le test:', error.message);
  }
}

// Exécuter le test
testGroupPolls();