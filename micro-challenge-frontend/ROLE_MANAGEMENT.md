# 🔐 Gestion des Rôles - Système de Différenciation Collaborateur/Admin

## 📋 Vue d'ensemble

Système professionnel pour différencier les collaborateurs et administrateurs sur la même page de login, avec détection automatique et sélection manuelle optionnelle.

## 🎯 Approches Implémentées

### **1. Détection Automatique par Email (Recommandée)**

**Principe :**
- Analyse automatique de l'email pour déterminer le rôle
- Aucune action requise de l'utilisateur
- Expérience fluide et transparente

**Règles de Détection :**
```javascript
const detectUserRole = (email) => {
  // Domaines administrateurs
  const adminDomains = ['admin.satoripop.com', 'direction.satoripop.com'];
  
  // Emails administrateurs spécifiques
  const adminEmails = [
    'admin@satoripop.com', 
    'directeur@satoripop.com', 
    'manager@satoripop.com'
  ];
  
  const domain = email.split('@')[1];
  
  if (adminEmails.includes(email.toLowerCase()) || adminDomains.includes(domain)) {
    return 'admin';
  }
  
  return 'collaborateur';
};
```

### **2. Sélecteur de Rôle Optionnel**

**Interface :**
- Section "Type de connexion" pliable
- 3 options : Détection automatique, Collaborateur, Administrateur
- Masqué par défaut pour simplicité

**Options Disponibles :**
- 🤖 **Détection automatique** (recommandé)
- 👤 **Collaborateur** (manuel)
- 🛡️ **Administrateur** (manuel)

## 🚀 Fonctionnalités Avancées

### **Messages de Bienvenue Personnalisés**

```javascript
const getWelcomeMessage = (userRole, userName) => {
  switch (userRole) {
    case 'admin':
      return `Bienvenue ${userName} ! Accès administrateur activé.`;
    case 'manager':
      return `Bienvenue ${userName} ! Accès manager activé.`;
    default:
      return `Bienvenue ${userName} ! Bon retour sur Satoripop.`;
  }
};
```

### **Redirection Intelligente par Rôle**

```javascript
const getRedirectPath = (userRole, from) => {
  switch (userRole) {
    case 'admin':
      return from || '/admin';
    case 'manager':
      return from || '/manager-dashboard';
    default:
      return from || '/accueil';
  }
};
```

### **Connexions Rapides Multi-Rôles**

**3 Boutons de Démo :**
- 🔴 **Admin** : `admin@satoripop.com` / `admin123`
- 🟢 **Manager** : `manager@satoripop.com` / `manager123`
- 🔵 **User** : `user@satoripop.com` / `user123`

## 🔧 Configuration Côté Serveur

### **Endpoint API Modifié**

```javascript
// POST /api/auth/login
{
  "email": "admin@satoripop.com",
  "password": "admin123",
  "expectedRole": "admin" // Nouveau champ
}
```

### **Validation Côté Serveur**

```javascript
// Exemple de validation côté serveur
app.post('/api/auth/login', async (req, res) => {
  const { email, password, expectedRole } = req.body;
  
  // Authentification normale
  const user = await authenticateUser(email, password);
  
  // Vérification de cohérence du rôle
  if (expectedRole && user.role !== expectedRole) {
    return res.status(400).json({
      msg: `Rôle attendu: ${expectedRole}, mais votre compte est: ${user.role}`
    });
  }
  
  // Génération du token avec rôle
  const token = generateToken(user);
  
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      username: user.username
    }
  });
});
```

## 🎨 Interface Utilisateur

### **États Visuels**

**Détection Automatique (par défaut) :**
```
┌─────────────────────────────────┐
│ Type de connexion    Personnaliser │
│ 🤖 Détection automatique basée    │
│    sur votre email                │
└─────────────────────────────────┘
```

**Sélection Manuelle (étendue) :**
```
┌─────────────────────────────────┐
│ Type de connexion        Masquer │
│ ○ 🤖 Détection automatique      │
│ ○ 👤 Collaborateur              │
│ ● 🛡️ Administrateur             │
└─────────────────────────────────┘
```

### **Indicateur de Rôle Sélectionné**

Quand un rôle manuel est choisi :
```
Rôle sélectionné: admin
```

## 📊 Avantages de cette Approche

### **1. Simplicité par Défaut**
- ✅ Interface épurée (détection automatique)
- ✅ Aucune action requise de l'utilisateur
- ✅ Expérience fluide

### **2. Flexibilité Avancée**
- ✅ Option de sélection manuelle
- ✅ Support multi-rôles (admin, manager, user)
- ✅ Extensible facilement

### **3. Sécurité Renforcée**
- ✅ Validation côté serveur
- ✅ Vérification de cohérence des rôles
- ✅ Messages d'erreur explicites

### **4. Expérience Développeur**
- ✅ Connexions rapides pour les tests
- ✅ Indicateurs visuels clairs
- ✅ Logs détaillés

## 🔄 Flux de Connexion

### **Scénario 1 : Détection Automatique**
1. Utilisateur saisit `admin@satoripop.com`
2. Système détecte automatiquement le rôle "admin"
3. Connexion avec validation côté serveur
4. Redirection vers `/admin`
5. Message : "Bienvenue ! Accès administrateur activé."

### **Scénario 2 : Sélection Manuelle**
1. Utilisateur clique "Personnaliser"
2. Sélectionne "Administrateur"
3. Saisit ses identifiants
4. Connexion avec rôle forcé
5. Validation de cohérence côté serveur

### **Scénario 3 : Connexion Rapide**
1. Utilisateur clique "Admin" (bouton rouge)
2. Auto-remplissage des credentials
3. Rôle défini automatiquement sur "admin"
4. Connexion immédiate

## 🛠️ Personnalisation

### **Ajouter un Nouveau Rôle**

1. **Côté Client :**
```javascript
// Dans detectUserRole()
if (email.includes('moderateur')) {
  return 'moderateur';
}

// Dans getRedirectPath()
case 'moderateur':
  return from || '/moderateur-dashboard';

// Dans quickLogin()
moderateur: {
  email: "mod@satoripop.com",
  password: "mod123",
  role: "moderateur"
}
```

2. **Interface :**
```jsx
<label className="flex items-center gap-2 cursor-pointer">
  <input type="radio" value="moderateur" />
  <span>🛡️ Modérateur</span>
</label>
```

### **Modifier les Règles de Détection**

```javascript
const detectUserRole = (email) => {
  // Règles personnalisées
  if (email.endsWith('@direction.company.com')) return 'admin';
  if (email.includes('manager')) return 'manager';
  if (email.includes('support')) return 'support';
  
  return 'collaborateur';
};
```

## 🎯 Recommandations

### **Pour la Production**
1. **Utiliser la détection automatique** par défaut
2. **Masquer le sélecteur** pour les utilisateurs normaux
3. **Activer la sélection manuelle** uniquement pour les tests
4. **Valider côté serveur** systématiquement

### **Pour le Développement**
1. **Utiliser les connexions rapides** pour les tests
2. **Activer tous les sélecteurs** pour la flexibilité
3. **Logger les tentatives** de connexion avec rôles
4. **Tester tous les scénarios** de redirection

---

Ce système offre la **flexibilité maximale** tout en gardant une **interface simple** ! 🚀
