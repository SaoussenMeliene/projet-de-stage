// Test direct du contrôleur proof
const proofCtrl = require('../Controllers/proof.controller');

console.log('🔍 Test du contrôleur proof...');
console.log('Fonctions disponibles:', Object.keys(proofCtrl));

if (proofCtrl.getMyProofs) {
  console.log('✅ getMyProofs existe');
} else {
  console.log('❌ getMyProofs manquante');
}

if (proofCtrl.submitProof) {
  console.log('✅ submitProof existe');
} else {
  console.log('❌ submitProof manquante');
}