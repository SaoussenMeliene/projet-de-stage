const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
require("dotenv").config();

/**
 * Script de diagnostic pour tester la connexion
 */

async function testLogin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    // Test avec un utilisateur existant
    const testEmail = "marie.dupont@satoripop.com";
    const testPassword = "marie123";

    console.log(`\n🔍 Test de connexion avec: ${testEmail}`);

    // Rechercher l'utilisateur
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log("❌ Utilisateur non trouvé dans la base de données");
      
      // Lister tous les utilisateurs
      const allUsers = await User.find({}, 'email username role');
      console.log("\n📋 Utilisateurs dans la base de données:");
      allUsers.forEach(u => {
        console.log(`- ${u.email} (${u.username}) - ${u.role}`);
      });
      
      return;
    }

    console.log("✅ Utilisateur trouvé:");
    console.log(`- Email: ${user.email}`);
    console.log(`- Username: ${user.username}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- FirstName: ${user.firstName || 'Non défini'}`);
    console.log(`- LastName: ${user.lastName || 'Non défini'}`);

    // Test du mot de passe
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (isMatch) {
      console.log("✅ Mot de passe correct");
      console.log("🎉 La connexion devrait fonctionner !");
    } else {
      console.log("❌ Mot de passe incorrect");
      console.log("🔍 Vérifiez le mot de passe dans la base de données");
    }

  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
    process.exit(0);
  }
}

// Exécuter le test
testLogin();
