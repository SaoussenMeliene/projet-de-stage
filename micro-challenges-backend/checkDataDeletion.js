const mongoose = require('mongoose');
const User = require('./Models/User');
require('dotenv').config();

async function monitorUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔍 Surveillance des utilisateurs dans MongoDB...');
    
    const checkUsers = async () => {
      const userCount = await User.countDocuments();
      const timestamp = new Date().toLocaleString();
      console.log(`[${timestamp}] 👥 Nombre d'utilisateurs: ${userCount}`);
      
      if (userCount === 0) {
        console.log('🚨 ALERTE: Tous les utilisateurs ont été supprimés !');
        
        // Vérifier les processus actifs
        console.log('📋 Processus Node.js actifs:');
        console.log('   - Vérifiez si des tests sont en cours d\'exécution');
        console.log('   - Vérifiez si des scripts automatiques s\'exécutent');
      }
    };
    
    // Vérification initiale
    await checkUsers();
    
    // Vérification toutes les 10 secondes
    setInterval(checkUsers, 10000);
    
    console.log('🔄 Surveillance active (Ctrl+C pour arrêter)...');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

monitorUsers();