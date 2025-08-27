// Script de débogage pour diagnostiquer le problème d'affichage des défis
import * as challengeService from './challenges.js';

export const debugChallenges = async () => {
  console.log('🔍 === DIAGNOSTIC DES CHALLENGES ===\n');

  try {
    console.log('1. Test de base - récupération des challenges...');
    const result = await challengeService.list();
    
    console.log('✅ Appel API réussi');
    console.log('📊 Réponse complète:', JSON.stringify(result, null, 2));
    
    if (!result) {
      console.log('❌ PROBLÈME: Aucune réponse de l\'API');
      return;
    }
    
    if (!result.challenges) {
      console.log('❌ PROBLÈME: Pas de propriété "challenges" dans la réponse');
      console.log('Structure reçue:', Object.keys(result));
      return;
    }
    
    if (!Array.isArray(result.challenges)) {
      console.log('❌ PROBLÈME: "challenges" n\'est pas un tableau');
      console.log('Type reçu:', typeof result.challenges);
      return;
    }
    
    console.log(`📈 Nombre de challenges trouvés: ${result.challenges.length}`);
    
    if (result.challenges.length === 0) {
      console.log('⚠️  PROBLÈME IDENTIFIÉ: Aucun challenge dans la base de données');
      console.log('💡 Solution: Ajouter des challenges via l\'interface d\'administration');
      
      // Test des stats pour confirmer
      try {
        const stats = await challengeService.stats();
        console.log('📊 Statistiques:', JSON.stringify(stats, null, 2));
      } catch (statsError) {
        console.log('❌ Erreur lors de la récupération des stats:', statsError.message);
      }
    } else {
      console.log('✅ Challenges trouvés:');
      result.challenges.forEach((challenge, index) => {
        console.log(`   ${index + 1}. ${challenge.title} (ID: ${challenge.id})`);
        console.log(`      Catégorie: ${challenge.category || 'Non définie'}`);
        console.log(`      Statut: ${challenge.status || 'Non défini'}`);
        console.log(`      Date: ${challenge.startDate || 'Non définie'}`);
      });
    }
    
    console.log(`\n📋 Informations supplémentaires:`);
    console.log(`   - Page courante: ${result.currentPage || 'Non définie'}`);
    console.log(`   - Nombre total: ${result.totalCount || 'Non défini'}`);
    console.log(`   - Limite par page: ${result.limit || 'Non définie'}`);
    
  } catch (error) {
    console.log('❌ ERREUR lors de l\'appel API:', error.message);
    
    if (error.response) {
      console.log('📝 Détails de l\'erreur:');
      console.log(`   - Status: ${error.response.status}`);
      console.log(`   - Status Text: ${error.response.statusText}`);
      console.log(`   - Data:`, error.response.data);
    } else if (error.request) {
      console.log('📝 Problème de réseau:');
      console.log('   - Pas de réponse du serveur');
      console.log('   - Vérifiez que le backend est démarré sur le port 5000');
    } else {
      console.log('📝 Erreur de configuration:', error.message);
    }
  }

  console.log('\n🔧 === TESTS COMPLÉMENTAIRES ===\n');

  // Test avec différents paramètres
  const testParams = [
    { name: 'Tous les statuts', params: { status: 'all' } },
    { name: 'Statut actif', params: { status: 'active' } },
    { name: 'Première page', params: { page: 1 } },
    { name: 'Limite élevée', params: { limit: 50 } },
  ];

  for (const test of testParams) {
    try {
      console.log(`🧪 Test: ${test.name}`);
      const result = await challengeService.list(test.params);
      console.log(`   Résultat: ${result.challenges?.length || 0} challenges`);
    } catch (error) {
      console.log(`   ❌ Erreur: ${error.message}`);
    }
  }

  console.log('\n💡 === RECOMMANDATIONS ===\n');
  console.log('Si aucun challenge n\'est trouvé:');
  console.log('1. Vérifiez la base de données backend');
  console.log('2. Créez quelques challenges de test');
  console.log('3. Vérifiez les filtres par défaut dans le frontend');
  console.log('4. Contrôlez les dates de début/fin des challenges existants');
};

// Fonction utilitaire pour tester depuis la console du navigateur
window.debugChallenges = debugChallenges;