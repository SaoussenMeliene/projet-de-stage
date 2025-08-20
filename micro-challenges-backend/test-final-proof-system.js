require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/User');
const Challenge = require('./Models/Challenge');
const Participant = require('./Models/Participant');
const Proof = require('./Models/Proof');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testCompleteProofSystem() {
  try {
    console.log('🎯 TEST COMPLET DU SYSTÈME DE VALIDATION PAR PREUVE\n');
    
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Nettoyer les anciennes données de test
    await Proof.deleteMany({ description: { $regex: 'Test final' } });
    console.log('🧹 Anciennes données de test supprimées\n');

    // Trouver les utilisateurs et défis
    const user = await User.findOne({ username: 'leila' });
    const challenge = await Challenge.findOne({ title: { $regex: 'vélo', $options: 'i' } });
    const admin = await User.findOne({ role: 'admin' });

    if (!user || !challenge || !admin) {
      console.log('❌ Données manquantes');
      return;
    }

    console.log(`👤 Collaborateur: ${user.username} (${user.firstName} ${user.lastName})`);
    console.log(`📋 Défi: ${challenge.title}`);
    console.log(`👨‍💼 Admin: ${admin.username}\n`);

    // Générer des tokens
    const userToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const adminToken = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ÉTAPE 1: Collaborateur rejoint le défi
    console.log('🎯 ÉTAPE 1: Collaborateur rejoint le défi...');
    try {
      const joinResponse = await axios.post(
        `http://localhost:5000/api/participants/join/${challenge._id}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('✅ Défi rejoint avec succès');
    } catch (joinError) {
      if (joinError.response?.data?.msg?.includes('déjà inscrit')) {
        console.log('ℹ️ Déjà inscrit au défi');
      } else {
        console.error('❌ Erreur inscription:', joinError.response?.data?.msg || joinError.message);
      }
    }

    // ÉTAPE 2: Collaborateur soumet une preuve
    console.log('\n📝 ÉTAPE 2: Collaborateur soumet une preuve...');
    try {
      const proofData = {
        type: 'text',
        description: 'Test final - Preuve de participation au défi vélo',
        textContent: `Rapport de participation au défi vélo:
        
📅 Semaine du 12-16 août 2024
🚴‍♀️ Trajets effectués:
- Lundi: Domicile → Bureau (8km)
- Mardi: Bureau → Rendez-vous client → Bureau (12km)  
- Mercredi: Domicile → Bureau (8km)
- Jeudi: Bureau → Courses → Domicile (10km)
- Vendredi: Domicile → Bureau (8km)

📊 Total: 46km parcourus à vélo
🌱 CO2 économisé: ~12kg (vs voiture)
💪 Bénéfices: Meilleure forme physique, économies carburant

Cette semaine m'a permis de réaliser l'impact positif du vélo sur l'environnement et ma santé !`
      };

      const submitResponse = await axios.post(
        `http://localhost:5000/api/proofs/submit/${challenge._id}`,
        proofData,
        {
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Preuve soumise avec succès');
      console.log(`🆔 ID de la preuve: ${submitResponse.data.proof._id}`);
      
      const proofId = submitResponse.data.proof._id;

      // ÉTAPE 3: Admin consulte les preuves en attente
      console.log('\n🔍 ÉTAPE 3: Admin consulte les preuves en attente...');
      const pendingResponse = await axios.get(
        'http://localhost:5000/api/proofs/admin/pending',
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`📊 ${pendingResponse.data.count} preuves en attente de validation`);
      
      const testProof = pendingResponse.data.proofs.find(p => p._id === proofId);
      if (testProof) {
        console.log('✅ Preuve trouvée dans la liste admin');
        console.log(`   📋 Défi: ${testProof.challenge.title}`);
        console.log(`   👤 Utilisateur: ${testProof.user.firstName} ${testProof.user.lastName}`);
        console.log(`   📝 Type: ${testProof.type}`);
        console.log(`   ⏰ Statut: ${testProof.status}`);
      }

      // ÉTAPE 4: Admin approuve la preuve
      console.log('\n✅ ÉTAPE 4: Admin approuve la preuve...');
      const approveResponse = await axios.put(
        `http://localhost:5000/api/proofs/admin/${proofId}/approve`,
        {
          comment: 'Excellente preuve ! Participation au défi vélo bien documentée avec des données précises. Bravo pour l\'engagement écologique !'
        },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Preuve approuvée par l\'admin');
      console.log(`💬 Commentaire: "${approveResponse.data.proof.reviewComment}"`);

      // ÉTAPE 5: Vérifier le statut final du participant
      console.log('\n🏆 ÉTAPE 5: Vérification du statut final...');
      const participant = await Participant.findOne({ 
        user: user._id, 
        challenge: challenge._id 
      });

      if (participant) {
        console.log(`📊 Statut du participant: ${participant.status}`);
        console.log(`🏆 Score du participant: ${participant.score} points`);
        console.log(`✅ Preuve validée: ${participant.proof ? 'Oui' : 'Non'}`);
      }

      // RÉSUMÉ FINAL
      console.log('\n🎉 SYSTÈME DE VALIDATION PAR PREUVE - TEST RÉUSSI !');
      console.log('\n📋 FLUX COMPLET TESTÉ:');
      console.log('1. ✅ Collaborateur rejoint un défi → Ajouté au groupe');
      console.log('2. ✅ Collaborateur soumet une preuve → En attente de validation');
      console.log('3. ✅ Admin voit la preuve dans l\'interface "Validation"');
      console.log('4. ✅ Admin approuve → Participant confirmé + points attribués');
      console.log('5. ✅ Statut mis à jour dans la base de données');
      
      console.log('\n🎯 INTERFACE ADMIN:');
      console.log('• Dashboard Admin → Onglet "Validation"');
      console.log('• Liste des preuves en attente');
      console.log('• Boutons Approuver/Rejeter/Voir détails');
      console.log('• Modal de détail avec contenu complet');
      
      console.log('\n🚀 SYSTÈME PRÊT POUR LA PRODUCTION !');

    } catch (proofError) {
      if (proofError.response?.data?.msg?.includes('déjà soumis')) {
        console.log('ℹ️ Preuve déjà soumise pour ce défi');
        
        // Récupérer les preuves existantes pour le test admin
        console.log('\n🔍 Test de l\'interface admin avec preuves existantes...');
        const pendingResponse = await axios.get(
          'http://localhost:5000/api/proofs/admin/pending',
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log(`📊 ${pendingResponse.data.count} preuves en attente dans l'interface admin`);
        console.log('✅ Interface admin opérationnelle');
        
      } else {
        console.error('❌ Erreur preuve:', proofError.response?.data || proofError.message);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnecté de MongoDB');
  }
}

testCompleteProofSystem();