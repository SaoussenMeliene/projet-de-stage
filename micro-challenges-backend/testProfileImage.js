const axios = require('axios');

async function testProfileImage() {
  console.log('🧪 TEST DE L\'IMAGE DE PROFIL');
  console.log('=============================\n');

  try {
    // Test 1: Connexion avec un utilisateur existant
    console.log('1️⃣ Test de connexion...');
    
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'ahmed@satoripop.com',
      password: 'password123'
    });

    console.log('✅ Connexion réussie');
    const { user, token } = loginResponse.data;
    console.log('👤 Utilisateur:', {
      email: user.email,
      username: user.username,
      profileImage: user.profileImage || 'Aucune image'
    });

    // Test 2: Récupération du profil complet
    console.log('\n2️⃣ Test de récupération du profil...');
    
    const profileResponse = await axios.get('http://localhost:5000/api/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Profil récupéré');
    const profileUser = profileResponse.data;
    console.log('👤 Profil complet:', {
      email: profileUser.email,
      username: profileUser.username,
      firstName: profileUser.firstName,
      lastName: profileUser.lastName,
      profileImage: profileUser.profileImage || 'Aucune image',
      role: profileUser.role
    });

    // Test 3: Vérification de l'accès à l'image si elle existe
    if (profileUser.profileImage) {
      console.log('\n3️⃣ Test d\'accès à l\'image...');
      
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
    } else {
      console.log('\n3️⃣ Aucune image de profil trouvée pour cet utilisateur');
    }

    console.log('\n🎉 TESTS TERMINÉS !');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testProfileImage();
