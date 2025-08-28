const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const Challenge = require('../Models/Challenge');
const UserReward = require('../Models/UserReward');
require('dotenv').config();

// Données de base à restaurer
const adminUser = {
  username: "admin",
  email: "admin@satoripop.com",
  password: "admin123",
  firstName: "Admin",
  lastName: "System",
  role: "admin"
};

const collaboratorExamples = [
  {
    username: "marie_martin",
    email: "marie.martin@satoripop.com", 
    password: "marie123",
    firstName: "Marie",
    lastName: "Martin",
    role: "collaborateur",
    points: 500
  },
  {
    username: "jean_dupont",
    email: "jean.dupont@satoripop.com",
    password: "jean123", 
    firstName: "Jean",
    lastName: "Dupont",
    role: "collaborateur",
    points: 750
  },
  {
    username: "claire_moreau",
    email: "claire.moreau@satoripop.com",
    password: "claire123",
    firstName: "Claire", 
    lastName: "Moreau",
    role: "collaborateur",
    points: 300
  },
  {
    username: "thomas_bernard",
    email: "thomas.bernard@satoripop.com",
    password: "thomas123",
    firstName: "Thomas",
    lastName: "Bernard", 
    role: "collaborateur",
    points: 600
  }
];

const exampleChallenges = [
  {
    title: "Défi Écologique",
    description: "Réduisez votre empreinte carbone en utilisant les transports en commun pendant une semaine",
    category: "écologique",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
  },
  {
    title: "Challenge Bien-être Sportif",
    description: "Pratiquez 30 minutes d'exercice physique chaque jour pendant 2 semaines",
    category: "sportif",
    startDate: new Date(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000) // 45 jours
  },
  {
    title: "Innovation Créative",
    description: "Proposez une idée d'amélioration pour l'entreprise et présentez-la à votre équipe",
    category: "créatif",
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 jours
  },
  {
    title: "Formation Éducative",
    description: "Suivez un cours en ligne et partagez vos apprentissages avec l'équipe",
    category: "éducatif",
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 21 jours
  },
  {
    title: "Action Solidaire",
    description: "Participez à une action solidaire ou de bénévolat dans votre communauté",
    category: "solidaire",
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours
  }
];

const exampleRewards = [
  {
    name: "Gourde Écologique",
    description: "Gourde réutilisable en bambou, parfaite pour rester hydraté tout en respectant l'environnement",
    pointsRequired: 200,
    category: "Éco-responsable",
    isActive: true,
    stock: 50,
    imageUrl: "/images/gourde-bambou.jpg"
  },
  {
    name: "Bon Repas Restaurant",
    description: "Bon d'achat de 25€ valable dans les restaurants partenaires",
    pointsRequired: 400,
    category: "Restauration",
    isActive: true,
    stock: 30,
    imageUrl: "/images/bon-restaurant.jpg"
  },
  {
    name: "Casque Audio",
    description: "Casque audio Bluetooth de qualité premium pour votre confort au travail",
    pointsRequired: 800,
    category: "High-Tech",
    isActive: true,
    stock: 20,
    imageUrl: "/images/casque-audio.jpg"
  },
  {
    name: "Journée de Télétravail",
    description: "Une journée de télétravail supplémentaire à utiliser selon vos besoins",
    pointsRequired: 300,
    category: "Bien-être",
    isActive: true,
    stock: 100,
    imageUrl: "/images/teletravail.jpg"
  },
  {
    name: "Formation en ligne",
    description: "Accès à une formation en ligne de votre choix (valeur 100€)",
    pointsRequired: 600,
    category: "Formation",
    isActive: true,
    stock: 25,
    imageUrl: "/images/formation.jpg"
  }
];

async function restoreAllData() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier les données actuelles
    const userCount = await User.countDocuments();
    const challengeCount = await Challenge.countDocuments();
    
    console.log(`📊 État actuel:`);
    console.log(`   - Utilisateurs: ${userCount}`);
    console.log(`   - Défis: ${challengeCount}`);

    if (userCount > 0) {
      const proceed = require('readline-sync').question(
        '⚠️  Des données existent déjà. Continuer ? (y/N): '
      );
      if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
        console.log('❌ Restauration annulée');
        return;
      }
    }

    console.log('\n🔄 Début de la restauration...\n');

    // 1. Restaurer l'admin
    console.log('👑 Restauration du compte admin...');
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      const admin = new User({
        ...adminUser,
        password: hashedPassword
      });
      await admin.save();
      console.log('✅ Compte admin créé');
    } else {
      console.log('ℹ️  Compte admin existe déjà');
    }

    // 2. Restaurer les collaborateurs
    console.log('\n👥 Restauration des collaborateurs...');
    for (const userData of collaboratorExamples) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = new User({
          ...userData,
          password: hashedPassword
        });
        await user.save();
        console.log(`✅ Collaborateur créé: ${userData.firstName} ${userData.lastName}`);
      } else {
        console.log(`ℹ️  Collaborateur existe: ${userData.firstName} ${userData.lastName}`);
      }
    }

    // 3. Restaurer les défis
    console.log('\n🎯 Restauration des défis...');
    for (const challengeData of exampleChallenges) {
      const existing = await Challenge.findOne({ title: challengeData.title });
      if (!existing) {
        const challenge = new Challenge(challengeData);
        await challenge.save();
        console.log(`✅ Défi créé: ${challengeData.title}`);
      } else {
        console.log(`ℹ️  Défi existe: ${challengeData.title}`);
      }
    }

    // 4. Créer le modèle Reward s'il n'existe pas
    const RewardSchema = new mongoose.Schema({
      name: { type: String, required: true },
      description: { type: String, required: true },
      pointsRequired: { type: Number, required: true },
      category: { type: String, required: true },
      isActive: { type: Boolean, default: true },
      stock: { type: Number, default: 0 },
      imageUrl: String,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    });

    let Reward;
    try {
      Reward = mongoose.model('Reward');
    } catch {
      Reward = mongoose.model('Reward', RewardSchema);
    }

    // 5. Restaurer les récompenses
    console.log('\n🎁 Restauration des récompenses...');
    const adminUserForRewards = await User.findOne({ role: 'admin' });
    
    for (const rewardData of exampleRewards) {
      const existing = await Reward.findOne({ name: rewardData.name });
      if (!existing) {
        const reward = new Reward({
          ...rewardData,
          createdBy: adminUserForRewards._id
        });
        await reward.save();
        console.log(`✅ Récompense créée: ${rewardData.name}`);
      } else {
        console.log(`ℹ️  Récompense existe: ${rewardData.name}`);
      }
    }

    // Statistiques finales
    const finalUserCount = await User.countDocuments();
    const finalChallengeCount = await Challenge.countDocuments();
    const finalRewardCount = await Reward.countDocuments();

    console.log('\n📈 Restauration terminée !');
    console.log('=' .repeat(50));
    console.log(`👥 Utilisateurs: ${finalUserCount}`);
    console.log(`🎯 Défis: ${finalChallengeCount}`);
    console.log(`🎁 Récompenses: ${finalRewardCount}`);
    console.log('=' .repeat(50));

    console.log('\n🔑 Comptes de connexion:');
    console.log('👑 Admin: admin@satoripop.com / admin123');
    console.log('👤 Marie: marie.martin@satoripop.com / marie123');
    console.log('👤 Jean: jean.dupont@satoripop.com / jean123');
    console.log('👤 Claire: claire.moreau@satoripop.com / claire123');
    console.log('👤 Thomas: thomas.bernard@satoripop.com / thomas123');

  } catch (error) {
    console.error('❌ Erreur lors de la restauration:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Connexion fermée');
  }
}

// Si le module readline-sync n'est pas installé, l'installer
try {
  require('readline-sync');
} catch {
  console.log('📦 Installation de readline-sync...');
  require('child_process').execSync('npm install readline-sync', { stdio: 'inherit' });
}

restoreAllData();