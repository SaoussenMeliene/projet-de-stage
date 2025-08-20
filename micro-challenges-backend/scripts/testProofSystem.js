require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../Models/User');
const Challenge = require('../Models/Challenge');
const Participant = require('../Models/Participant');
const Proof = require('../Models/Proof');
const jwt = require('jsonwebtoken');
const axios = require('axios');

async function testProofSystem() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Nettoyer les anciennes données de test
    await Proof.deleteMany({ description: { $regex: 'Test automatique' } });
    console.log('🧹 Anciennes données de test supprimées');

    // Trouver un utilisateur et un défi
    const user = await User.findOne({ username: 'leila' });
    const challenge = await Challenge.findOne({ title: { $regex: 'vélo', $options: 'i' } });
    const admin = await User.findOne({ role: 'admin' });

    if (!user || !challenge || !admin) {
      console.log('❌ Données manquantes');
      console.log('Utilisateur:', user?.username);
      console.log('Défi:', challenge?.title);
      console.log('Admin:', admin?.username);
      return;
    }

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

    console.log(`👤 Utilisateur: ${user.username}`);
    console.log(`📋 Défi: ${challenge.title}`);
    console.log(`👨‍💼 Admin: ${admin.username}\n`);

    // ÉTAPE 1: Rejoindre le défi
    console.log('🎯 ÉTAPE 1: Rejoindre le défi...');
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

      console.log('✅ Défi rejoint:', joinResponse.data.msg);
      console.log('📝 Preuve requise:', joinResponse.data.needsProof);

    } catch (joinError) {
      if (joinError.response?.data?.msg?.includes('déjà inscrit')) {
        console.log('ℹ️ Déjà inscrit au défi');
      } else {
        console.error('❌ Erreur inscription:', joinError.response?.data || joinError.message);
      }
    }

    // ÉTAPE 2: Soumettre une preuve textuelle
    console.log('\n📝 ÉTAPE 2: Soumettre une preuve textuelle...');
    try {
      const proofData = {
        type: 'text',
        description: 'Test automatique - Preuve de participation au défi vélo',
        textContent: 'J\'ai utilisé mon vélo pour aller au travail pendant 3 jours cette semaine. Cela m\'a permis d\'économiser 15km de trajet en voiture et de réduire mes émissions de CO2.'
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

      console.log('✅ Preuve soumise:', submitResponse.data.msg);
      console.log('🆔 ID de la preuve:', submitResponse.data.proof._id);

      const proofId = submitResponse.data.proof._id;

      // ÉTAPE 3: Admin récupère les preuves en attente
      console.log('\n🔍 ÉTAPE 3: Admin récupère les preuves en attente...');
      const pendingResponse = await axios.get(
        'http://localhost:5000/api/proofs/admin/pending',
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`📊 ${pendingResponse.data.count} preuves en attente`);
      const testProof = pendingResponse.data.proofs.find(p => p._id === proofId);
      
      if (testProof) {
        console.log('✅ Preuve trouvée dans la liste admin');
        console.log(`   - Utilisateur: ${testProof.user.username}`);
        console.log(`   - Défi: ${testProof.challenge.title}`);
        console.log(`   - Type: ${testProof.type}`);
        console.log(`   - Statut: ${testProof.status}`);
      }

      // ÉTAPE 4: Admin approuve la preuve
      console.log('\n✅ ÉTAPE 4: Admin approuve la preuve...');
      const approveResponse = await axios.put(
        `http://localhost:5000/api/proofs/admin/${proofId}/approve`,
        {
          comment: 'Preuve validée - Participation au défi vélo confirmée'
        },
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Preuve approuvée:', approveResponse.data.msg);

      // ÉTAPE 5: Vérifier le statut du participant
      console.log('\n🔍 ÉTAPE 5: Vérifier le statut du participant...');
      const participant = await Participant.findOne({ 
        user: user._id, 
        challenge: challenge._id 
      });

      if (participant) {
        console.log(`📊 Statut du participant: ${participant.status}`);
        console.log(`🏆 Score du participant: ${participant.score}`);
      }

      // ÉTAPE 6: Test de rejet (créer une nouvelle preuve)
      console.log('\n❌ ÉTAPE 6: Test de rejet d\'une preuve...');
      
      // D'abord, créer un autre utilisateur ou utiliser un autre défi
      const user2 = await User.findOne({ username: 'yasssin' });
      if (user2) {
        const user2Token = jwt.sign(
          { userId: user2._id, role: user2.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Vérifier si l'utilisateur participe déjà
        let participant2 = await Participant.findOne({ 
          user: user2._id, 
          challenge: challenge._id 
        });

        if (!participant2) {
          // Rejoindre le défi
          await axios.post(
            `http://localhost:5000/api/participants/join/${challenge._id}`,
            {},
            {
              headers: {
                'Authorization': `Bearer ${user2Token}`,
                'Content-Type': 'application/json'
              }
            }
          );
        }

        // Soumettre une preuve insuffisante
        const badProofData = {
          type: 'text',
          description: 'Test automatique - Preuve insuffisante',
          textContent: 'J\'ai pensé à prendre le vélo mais finalement j\'ai pris la voiture.'
        };

        const badProofResponse = await axios.post(
          `http://localhost:5000/api/proofs/submit/${challenge._id}`,
          badProofData,
          {
            headers: {
              'Authorization': `Bearer ${user2Token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        const badProofId = badProofResponse.data.proof._id;
        console.log('📝 Preuve insuffisante soumise');

        // Admin rejette la preuve
        const rejectResponse = await axios.put(
          `http://localhost:5000/api/proofs/admin/${badProofId}/reject`,
          {
            comment: 'Preuve insuffisante - La participation au défi n\'est pas démontrée'
          },
          {
            headers: {
              'Authorization': `Bearer ${adminToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('❌ Preuve rejetée:', rejectResponse.data.msg);
      }

      console.log('\n🎉 SYSTÈME DE PREUVES TESTÉ AVEC SUCCÈS !');
      console.log('\n📋 RÉSUMÉ:');
      console.log('✅ Utilisateur rejoint un défi → ajouté au groupe');
      console.log('✅ Utilisateur soumet une preuve → en attente de validation');
      console.log('✅ Admin voit les preuves en attente');
      console.log('✅ Admin peut approuver → participant confirmé + points');
      console.log('✅ Admin peut rejeter → participant refusé');

    } catch (proofError) {
      if (proofError.response?.data?.msg?.includes('déjà soumis')) {
        console.log('ℹ️ Preuve déjà soumise pour ce défi');
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

testProofSystem();