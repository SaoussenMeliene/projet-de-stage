const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
require("dotenv").config();

/**
 * Script pour créer le compte de Wassim
 */

async function createWassimAccount() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connecté à MongoDB");

    const email = "wassim@satoripop.com";
    const password = "monpassword123";

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("ℹ️ L'utilisateur existe déjà");
      
      // Test du mot de passe
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        console.log("✅ Mot de passe correct - La connexion devrait fonctionner");
      } else {
        console.log("❌ Mot de passe incorrect - Mise à jour du mot de passe...");
        
        // Mettre à jour le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(existingUser._id, { password: hashedPassword });
        console.log("✅ Mot de passe mis à jour");
      }
    } else {
      // Créer le nouvel utilisateur
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = new User({
        username: "wassim",
        email: email,
        password: hashedPassword,
        firstName: "Wassim",
        lastName: "", // Vous pouvez ajouter votre nom de famille
        company: "", // Vous pouvez ajouter votre entreprise
        role: "collaborateur"
      });

      await user.save();
      console.log("✅ Compte Wassim créé avec succès !");
    }

    console.log("\n🎯 Informations de connexion :");
    console.log("┌─────────────────────────────────────────┐");
    console.log("│              VOTRE COMPTE               │");
    console.log("├─────────────────────────────────────────┤");
    console.log("│ Email    : wassim@satoripop.com         │");
    console.log("│ Password : monpassword123               │");
    console.log("│ Rôle     : collaborateur                │");
    console.log("└─────────────────────────────────────────┘");

    console.log("\n🔍 Détection automatique :");
    console.log("• wassim@satoripop.com → collaborateur (email normal)");
    console.log("• Redirection vers /accueil après connexion");

    console.log("\n🚀 Testez maintenant :");
    console.log("1. Allez sur http://localhost:5173/login");
    console.log("2. Saisissez: wassim@satoripop.com / monpassword123");
    console.log("3. Cliquez 'Se connecter'");
    console.log("4. Vous devriez être redirigé vers /accueil");

  } catch (error) {
    console.error("❌ Erreur lors de la création du compte:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Déconnecté de MongoDB");
    process.exit(0);
  }
}

// Exécuter le script
createWassimAccount();
