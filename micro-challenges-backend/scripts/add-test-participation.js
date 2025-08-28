require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Participant = require('../models/Participant');

const addTestParticipation = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connexion à MongoDB réussie');

    // Trouver le premier utilisateur
    const user = await User.findOne().sort({ createdAt: -1 });
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé');
      return;
    }
    console.log('👤 Utilisateur trouvé:', user.email);

    // Créer ou trouver un défi de test
    let challenge = await Challenge.findOne({ title: 'Défi Test Performance' });
    if (!challenge) {
      challenge = new Challenge({
        title: 'Défi Test Performance',
        description: 'Un défi pour tester le système de points et performances',
        category: 'solidaire',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        maxParticipants: 100,
        createdBy: user._id,
        objectives: ['Objectif 1', 'Objectif 2'],
        rewards: ['Badge de test'],
        status: 'active'
      });
      await challenge.save();
      console.log('🎯 Défi créé:', challenge.title);
    } else {
      console.log('🎯 Défi existant trouvé:', challenge.title);
    }

    // Vérifier s'il existe déjà une participation
    const existingParticipation = await Participant.findOne({
      user: user._id,
      challenge: challenge._id
    });

    if (existingParticipation) {
      console.log('📊 Participation existante trouvée, mise à jour...');
      existingParticipation.status = 'confirmé';
      existingParticipation.score = 85;
      await existingParticipation.save();
      console.log('✅ Participation mise à jour avec succès!');
    } else {
      // Créer une nouvelle participation
      const participation = new Participant({
        user: user._id,
        challenge: challenge._id,
        status: 'confirmé',
        score: 85,
        joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Il y a 7 jours
      });
      await participation.save();
      console.log('✅ Nouvelle participation créée avec succès!');
    }

    // Créer une seconde participation en attente
    const challenge2 = new Challenge({
      title: 'Défi Test En Cours',
      description: 'Un défi en cours pour tester les points partiels',
      category: 'ecologique',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      maxParticipants: 100,
      createdBy: user._id,
      objectives: ['Objectif en cours'],
      rewards: ['Points partiels'],
      status: 'active'
    });
    await challenge2.save();

    const participation2 = new Participant({
      user: user._id,
      challenge: challenge2._id,
      status: 'en attente',
      score: 60,
      joinedAt: new Date(),
    });
    await participation2.save();

    console.log('🎉 Données de test créées avec succès!');
    console.log('📊 Résultat attendu:');
    console.log('   - Points totaux: 175 (100+50 pour défi confirmé + 25 pour défi en attente)');
    console.log('   - Défis terminés: 1');
    console.log('   - Taux de réussite: 50% (1 confirmé / 2 participations)');
    console.log('   - Score moyen: ~72 (moyenne des scores 85 et 60)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

addTestParticipation();