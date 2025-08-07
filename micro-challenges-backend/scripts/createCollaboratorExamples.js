const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
require("dotenv").config();

/**
 * Script pour créer des exemples de collaborateurs avec leurs vraies adresses
 * Simule des utilisateurs réels qui se sont inscrits avec leurs propres emails
 */

const collaboratorExamples = [
  {
    username: "marie_dupont",
    email: "marie.dupont@satoripop.com",
    password: "marie123",
    firstName: "Marie",
    lastName: "Dupont",
    role: "collaborateur"
  },
  {
    username: "jean_martin",
    email: "jean.martin@satoripop.com", 
    password: "jean123",
    firstName: "Jean",
    lastName: "Martin",
    role: "collaborateur"
  },
  {
    username: "sophie_bernard",
    email: "sophie.bernard@satoripop.com",
    password: "sophie123",
    firstName: "Sophie", 
    lastName: "Bernard",
    role: "collaborateur"
  },
  {
    username: "pierre_durand",
    email: "pierre.durand@satoripop.com",
    password: "pierre123",
    firstName: "Pierre",
    lastName: "Durand", 
    role: "collaborateur"
  },
  {
    username: "claire_moreau",
    email: "claire.moreau@satoripop.com",
    password: "claire123",
    firstName: "Claire",
    lastName: "Moreau",
    role: "collaborateur"
  }
];

async function createCollaboratorExamples() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Supprimer les exemples existants
    await User.deleteMany({ 
      email: { $in: collaboratorExamples.map(u => u.email) } 
    });
    console.log("🗑️ Exemples de collaborateurs existants supprimés");

    // Créer les nouveaux collaborateurs
    for (const userData of collaboratorExamples) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
      });

      await user.save();
      console.log(`✅ Collaborateur créé: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    }

    console.log("\n🎉 Tous les exemples de collaborateurs ont été créés !");
    console.log("\n📋 Exemples de Collaborateurs :");
    console.log("┌─────────────────────────────────────────────────────────────────┐");
    console.log("│                        COLLABORATEURS                          │");
    console.log("├─────────────────────────────────────────────────────────────────┤");
    collaboratorExamples.forEach(user => {
      console.log(`│ ${user.firstName} ${user.lastName.padEnd(10)} │ ${user.email.padEnd(25)} │ ${user.password.padEnd(8)} │`);
    });
    console.log("└─────────────────────────────────────────────────────────────────┘");

    console.log("\n🔍 Comment ça fonctionne :");
    console.log("1. Les collaborateurs s'inscrivent avec leur vraie adresse email");
    console.log("2. Lors de la connexion, le système détecte automatiquement 'collaborateur'");
    console.log("3. Redirection vers /accueil avec message personnalisé");
    
    console.log("\n📝 Exemples de détection automatique :");
    console.log("• marie.dupont@satoripop.com → collaborateur (email normal)");
    console.log("• admin@satoripop.com → admin (email spécifique)");
    console.log("• directeur@satoripop.com → admin (mot-clé 'directeur')");
    console.log("• chef.equipe@satoripop.com → admin (mot-clé 'chef')");

    console.log("\n🎯 Test avec un collaborateur réel :");
    console.log("1. Allez sur http://localhost:5173/login");
    console.log("2. Saisissez: marie.dupont@satoripop.com / marie123");
    console.log("3. Le système détectera automatiquement 'collaborateur'");
    console.log("4. Redirection vers /accueil");

  } catch (error) {
    console.error("❌ Erreur lors de la création des collaborateurs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
    process.exit(0);
  }
}

// Exécuter le script
createCollaboratorExamples();
