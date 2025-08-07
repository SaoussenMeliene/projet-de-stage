const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testImageUpload() {
  console.log('🧪 TEST D\'UPLOAD D\'IMAGE DE PROFIL');
  console.log('=================================\n');

  try {
    // Créer une image de test simple (pixel blanc 1x1)
    const testImagePath = path.join(__dirname, 'test-image.png');
    const testImageData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC2, 0x8A, 0x8E, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    fs.writeFileSync(testImagePath, testImageData);
    console.log('✅ Image de test créée');

    // Test 1: Inscription avec image
    console.log('\n1️⃣ Test d\'inscription avec image...');
    
    const formData = new FormData();
    formData.append('username', 'testuser_' + Date.now());
    formData.append('email', `test${Date.now()}@satoripop.com`);
    formData.append('password', 'testpassword123');
    formData.append('firstName', 'Test');
    formData.append('lastName', 'User');
    formData.append('role', 'collaborateur');
    formData.append('profileImage', fs.createReadStream(testImagePath));

    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });

    console.log('✅ Inscription réussie');
    console.log('📤 Réponse:', registerResponse.data);

    // Test 2: Connexion et vérification de l'image
    console.log('\n2️⃣ Test de connexion...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: formData.get('email'),
      password: 'testpassword123'
    });

    console.log('✅ Connexion réussie');
    const { user, token } = loginResponse.data;
    console.log('👤 Utilisateur:', user.email);
    console.log('🖼️ Image de profil:', user.profileImage || 'Aucune');

    // Test 3: Récupération du profil complet
    console.log('\n3️⃣ Test de récupération du profil...');
    
    const profileResponse = await axios.get('http://localhost:5000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Profil récupéré');
    const profileUser = profileResponse.data.user;
    console.log('👤 Profil complet:', {
      email: profileUser.email,
      username: profileUser.username,
      firstName: profileUser.firstName,
      lastName: profileUser.lastName,
      profileImage: profileUser.profileImage,
      role: profileUser.role
    });

    // Test 4: Vérification de l'accès à l'image
    if (profileUser.profileImage) {
      console.log('\n4️⃣ Test d\'accès à l\'image...');
      
      const imageUrl = `http://localhost:5000${profileUser.profileImage}`;
      console.log('🔗 URL de l\'image:', imageUrl);
      
      try {
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer'
        });
        
        console.log('✅ Image accessible');
        console.log('📊 Taille:', imageResponse.data.length, 'bytes');
        console.log('📋 Type:', imageResponse.headers['content-type']);
      } catch (imageError) {
        console.log('❌ Erreur d\'accès à l\'image:', imageError.message);
      }
    }

    // Nettoyage
    fs.unlinkSync(testImagePath);
    console.log('\n🧹 Fichier de test supprimé');

    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    
    // Nettoyage en cas d'erreur
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
}

testImageUpload();
