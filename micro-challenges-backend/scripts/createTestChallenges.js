require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../Models/Challenge');

const testChallenges = [
  {
    title: "Défi Zéro Déchet - Semaine Verte",
    description: "Réduisez vos déchets au maximum pendant 7 jours consécutifs",
    longDescription: "Ce défi vous invite à adopter des habitudes zéro déchet pendant une semaine complète. Vous devrez documenter vos actions quotidiennes pour réduire vos déchets plastiques et alimentaires.",
    category: "écologique",
    difficulty: "Moyen",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
    rewardPoints: 200,
    tasks: [
      "Utiliser des sacs réutilisables",
      "Éviter les emballages plastiques",
      "Composter les déchets organiques",
      "Documenter ses actions avec des photos"
    ]
  },
  {
    title: "Solidarité Numérique - Aidez les Seniors",
    description: "Accompagnez des personnes âgées dans l'utilisation des outils numériques",
    longDescription: "Organisez des sessions d'aide pour les personnes âgées qui souhaitent apprendre à utiliser les smartphones, tablettes ou ordinateurs.",
    category: "solidaire", 
    difficulty: "Facile",
    startDate: new Date(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 jours
    rewardPoints: 250,
    tasks: [
      "Trouver 3 personnes à aider",
      "Organiser au moins 2 sessions par personne",
      "Créer un petit guide pratique",
      "Partager vos retours d'expérience"
    ]
  },
  {
    title: "Art Urbain Collaboratif",
    description: "Créez une œuvre d'art collaborative dans votre quartier",
    longDescription: "Mobilisez votre communauté pour créer une fresque murale ou une installation artistique qui embellit l'espace public.",
    category: "créatif",
    difficulty: "Difficile", 
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
    rewardPoints: 350,
    tasks: [
      "Obtenir les autorisations nécessaires",
      "Rassembler au moins 5 participants",
      "Dessiner un croquis de l'œuvre",
      "Réaliser l'œuvre en équipe",
      "Organiser une inauguration"
    ]
  },
  {
    title: "Challenge Vélo - 100km en 10 jours", 
    description: "Parcourez 100 kilomètres à vélo en 10 jours maximum",
    longDescription: "Relevez ce défi sportif en parcourant 100km à vélo sur une période de 10 jours. Parfait pour se remettre en forme tout en réduisant son empreinte carbone.",
    category: "sportif",
    difficulty: "Moyen",
    startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Dans 1 jour
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 jours
    rewardPoints: 180,
    tasks: [
      "Planifier vos itinéraires",
      "Enregistrer vos trajets quotidiens", 
      "Atteindre les 100km",
      "Partager vos photos de parcours"
    ]
  }
];

async function createTestChallenges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Supprimer les anciens défis de test s'ils existent
    await Challenge.deleteMany({ 
      title: { $in: testChallenges.map(c => c.title) } 
    });

    // Créer les nouveaux défis
    const created = await Challenge.insertMany(testChallenges);
    
    console.log(`🎯 ${created.length} défis de test créés avec succès:`);
    created.forEach(challenge => {
      console.log(`   - ${challenge.title} (${challenge.category})`);
    });

    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

createTestChallenges();