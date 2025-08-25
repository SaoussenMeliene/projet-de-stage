const mongoose = require('mongoose');
const User = require('../Models/User');
const Challenge = require('../Models/Challenge');
const Participant = require('../Models/Participant');

// Configuration de la base de données
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/micro-challenges', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connecté à MongoDB');
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB:', error.message);
    process.exit(1);
  }
};

const createTestParticipations = async () => {
  try {
    await connectDB();

    // Trouver un utilisateur existant
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Créez d\'abord des utilisateurs.');
      return;
    }

    // Créer quelques défis de test s'ils n'existent pas
    const testChallenges = [
      {
        title: 'Défi Écologique 2024',
        description: 'Réduisez votre empreinte carbone pendant 30 jours',
        category: 'Environnement',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true
      },
      {
        title: 'Challenge Sport Quotidien',
        description: '30 minutes d\'exercice par jour pendant 3 semaines',
        category: 'Bien-être',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-02-05'),
        isActive: true
      },
      {
        title: 'Défi Lecture Mensuel',
        description: 'Lire au moins 3 livres ce mois-ci',
        category: 'Éducation',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        isActive: true
      },
      {
        title: 'Méditation Mindfulness',
        description: '10 minutes de méditation quotidienne',
        category: 'Bien-être',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-02-10'),
        isActive: true
      }
    ];

    // Créer les défis s'ils n'existent pas
    const challenges = [];
    for (const challengeData of testChallenges) {
      let challenge = await Challenge.findOne({ title: challengeData.title });
      if (!challenge) {
        challenge = await Challenge.create(challengeData);
        console.log(`✅ Défi créé: ${challenge.title}`);
      }
      challenges.push(challenge);
    }

    // Créer des participations pour chaque utilisateur
    for (const user of users) {
      console.log(`\n👤 Création de participations pour: ${user.username || user.email}`);
      
      // Supprimer les anciennes participations de test
      await Participant.deleteMany({ user: user._id });
      console.log('🗑️ Anciennes participations supprimées');

      const participations = [
        {
          user: user._id,
          challenge: challenges[0]._id, // Défi Écologique - confirmé avec score
          status: 'confirmé',
          score: Math.floor(Math.random() * 20) + 80, // Score entre 80-100
          joinedAt: new Date('2024-01-02')
        },
        {
          user: user._id,
          challenge: challenges[1]._id, // Challenge Sport - confirmé avec score
          status: 'confirmé',
          score: Math.floor(Math.random() * 30) + 70, // Score entre 70-100
          joinedAt: new Date('2024-01-16')
        },
        {
          user: user._id,
          challenge: challenges[2]._id, // Défi Lecture - en attente
          status: 'en attente',
          score: 0,
          joinedAt: new Date('2024-01-20')
        },
        {
          user: user._id,
          challenge: challenges[3]._id, // Méditation - en attente
          status: 'en attente',
          score: 0,
          joinedAt: new Date('2024-01-25')
        }
      ];

      // Créer les participations
      const createdParticipations = await Participant.create(participations);
      
      console.log(`✅ ${createdParticipations.length} participations créées:`);
      createdParticipations.forEach(p => {
        console.log(`   - ${challenges.find(c => c._id.toString() === p.challenge.toString())?.title} (${p.status})`);
      });
    }

    console.log('\n🎉 Participations de test créées avec succès !');
    console.log('\nRésumé par utilisateur:');
    
    for (const user of users) {
      const userParticipations = await Participant.find({ user: user._id })
        .populate('challenge', 'title')
        .sort({ createdAt: -1 });
      
      console.log(`\n👤 ${user.username || user.email}:`);
      console.log(`   📊 Total participations: ${userParticipations.length}`);
      console.log(`   🎯 Défis actifs: ${userParticipations.filter(p => p.status === 'en attente' || p.status === 'confirmé').length}`);
      console.log(`   ✅ Défis confirmés: ${userParticipations.filter(p => p.status === 'confirmé').length}`);
      console.log(`   🏆 Badges (score > 80): ${userParticipations.filter(p => p.status === 'confirmé' && p.score > 80).length}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de la création des participations:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTestParticipations();