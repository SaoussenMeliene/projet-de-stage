const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
require("dotenv").config();

/**
 * Script pour créer des utilisateurs de test
 * Permet de tester le Scénario 2 (détection automatique admin)
 */

const testUsers = [
  {
    username: "admin",
    email: "admin@satoripop.com",
    password: "admin123",
    role: "admin"
  },
  {
    username: "directeur",
    email: "directeur@satoripop.com", 
    password: "directeur123",
    role: "admin"
  },
  {
    username: "manager",
    email: "manager@satoripop.com",
    password: "manager123", 
    role: "admin"
  },
  {
    username: "user1",
    email: "user@satoripop.com",
    password: "user123",
    role: "collaborateur"
  },
  {
    username: "collaborateur1",
    email: "collab@satoripop.com",
    password: "collab123",
    role: "collaborateur"
  }
];

async function createTestUsers() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Supprimer les utilisateurs de test existants
    await User.deleteMany({ 
      email: { $in: testUsers.map(u => u.email) } 
    });
    console.log("🗑️ Utilisateurs de test existants supprimés");

    // Créer les nouveaux utilisateurs
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role
      });

      await user.save();
      console.log(`✅ Utilisateur créé: ${userData.email} (${userData.role})`);
    }

    console.log("\n🎉 Tous les utilisateurs de test ont été créés !");
    console.log("\n📋 Credentials de test :");
    console.log("┌─────────────────────────────────────────────────────────┐");
    console.log("│                    ADMINISTRATEURS                      │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│ admin@satoripop.com     / admin123                     │");
    console.log("│ directeur@satoripop.com / directeur123                 │");
    console.log("│ manager@satoripop.com   / manager123                   │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│                   COLLABORATEURS                       │");
    console.log("├─────────────────────────────────────────────────────────┤");
    console.log("│ user@satoripop.com      / user123                      │");
    console.log("│ collab@satoripop.com    / collab123                    │");
    console.log("└─────────────────────────────────────────────────────────┘");

    console.log("\n🔍 Test du Scénario 2 :");
    console.log("1. Allez sur http://localhost:5173/login");
    console.log("2. Saisissez: admin@satoripop.com / admin123");
    console.log("3. Le système détectera automatiquement le rôle 'admin'");
    console.log("4. Redirection vers /admin avec message personnalisé");

  } catch (error) {
    console.error("❌ Erreur lors de la création des utilisateurs:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
    process.exit(0);
  }
}

// Exécuter le script
createTestUsers();
