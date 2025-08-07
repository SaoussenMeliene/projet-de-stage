const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./Models/User');
require('dotenv').config();

async function testCreateAndLogin() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');

    // Données du nouvel utilisateur
    const newUserData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'test123',
      role: 'collaborateur',
      firstName: 'Test',
      lastName: 'User'
    };

    console.log('\n🆕 Création d\'un nouvel utilisateur...');
    console.log('📧 Email:', newUserData.email);
    console.log('👤 Username:', newUserData.username);
    console.log('🔑 Mot de passe:', newUserData.password);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: newUserData.email });
    if (existingUser) {
      console.log('⚠️  Utilisateur existe déjà, suppression...');
      await User.deleteOne({ email: newUserData.email });
      console.log('🗑️  Utilisateur supprimé');
    }

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newUserData.password, saltRounds);

    // Créer l'utilisateur
    const newUser = new User({
      ...newUserData,
      password: hashedPassword
    });

    await newUser.save();
    console.log('✅ Utilisateur créé avec succès !');
    console.log('🆔 ID:', newUser._id);

    // Test de connexion immédiatement après création
    console.log('\n🔐 Test de connexion...');
    
    const loginUser = await User.findOne({ email: newUserData.email });
    if (!loginUser) {
      console.log('❌ Utilisateur non trouvé pour la connexion');
      return;
    }

    const isMatch = await bcrypt.compare(newUserData.password, loginUser.password);
    console.log('🔑 Mot de passe correct:', isMatch ? 'OUI' : 'NON');

    if (isMatch) {
      console.log('🎉 CONNEXION RÉUSSIE !');
      console.log('📋 Données utilisateur:');
      console.log('- ID:', loginUser._id);
      console.log('- Username:', loginUser.username);
      console.log('- Email:', loginUser.email);
      console.log('- Role:', loginUser.role);
    } else {
      console.log('❌ ÉCHEC DE CONNEXION');
    }

    // Test avec l'API de login
    console.log('\n🌐 Test avec l\'API de login...');
    
    // Simuler la fonction login du controller
    const { login } = require('./Controllers/auth.controller');
    
    // Mock request et response
    const req = {
      body: {
        email: newUserData.email,
        password: newUserData.password
      }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        console.log('📤 Réponse API:', JSON.stringify(data, null, 2));
        return this;
      }
    };

    await login(req, res);
    console.log('📊 Status Code:', res.statusCode);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('📍 Stack:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

testCreateAndLogin();
