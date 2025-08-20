// Script pour vérifier les défis existants
const mongoose = require('mongoose');
require('dotenv').config();

const Challenge = require('../Models/Challenge');

async function checkChallenges() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/micro-challenges');
    console.log('✅ Connecté à MongoDB');

    // Compter tous les défis
    const totalChallenges = await Challenge.countDocuments();
    console.log(`📊 Total des défis: ${totalChallenges}`);

    if (totalChallenges === 0) {
      console.log('❌ Aucun défi trouvé dans la base de données');
      return;
    }

    // Récupérer quelques défis pour voir leur structure
    const challenges = await Challenge.find().limit(5).lean();
    console.log('\n📋 Exemples de défis:');
    challenges.forEach((challenge, index) => {
      console.log(`\n${index + 1}. ${challenge.title}`);
      console.log(`   - ID: ${challenge._id}`);
      console.log(`   - Catégorie: ${challenge.category}`);
      console.log(`   - Description: ${challenge.description?.substring(0, 100)}...`);
      console.log(`   - Participants: ${challenge.participants?.length || 0} (array) / ${challenge.participantsCount || 0} (count)`);
      console.log(`   - Dates: ${challenge.startDate || challenge.startAt} → ${challenge.endDate || challenge.endAt}`);
      console.log(`   - Image: ${challenge.image || challenge.coverImage || 'Aucune'}`);
    });

    // Statistiques par catégorie
    console.log('\n📈 Statistiques par catégorie:');
    const categoryStats = await Challenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    categoryStats.forEach(stat => {
      console.log(`   - ${stat._id}: ${stat.count} défis`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Déconnecté de MongoDB');
  }
}

checkChallenges();