# 👥 Guide de Connexion pour Collaborateurs

## 📋 Vue d'ensemble

Les collaborateurs se connectent avec **leur propre adresse email** qu'ils ont utilisée lors de l'inscription. Le système détecte automatiquement leur rôle et les redirige vers l'interface appropriée.

## 🔐 Comment ça Fonctionne

### **Pour les Collaborateurs**

1. **Inscription** : Ils s'inscrivent avec leur vraie adresse email
   - Exemple : `marie.dupont@satoripop.com`
   - Mot de passe : Celui qu'ils ont choisi

2. **Connexion** : Ils utilisent les mêmes identifiants
   - Email : `marie.dupont@satoripop.com`
   - Mot de passe : `marie123` (leur mot de passe)

3. **Détection automatique** : Le système reconnaît automatiquement "collaborateur"

4. **Redirection** : Vers `/accueil` (interface collaborateur)

### **Pour les Administrateurs**

1. **Emails spécifiques** reconnus comme admin :
   - `admin@satoripop.com`
   - `directeur@satoripop.com`
   - `manager@satoripop.com`
   - `direction@satoripop.com`
   - `chef@satoripop.com`

2. **Mots-clés** dans l'email qui indiquent un admin :
   - `admin` → `admin.quelquechose@satoripop.com`
   - `directeur` → `directeur.region@satoripop.com`
   - `manager` → `manager.equipe@satoripop.com`
   - `chef` → `chef.projet@satoripop.com`
   - `direction` → `direction.rh@satoripop.com`

3. **Redirection** : Vers `/admin` (interface administrateur)

## 🎯 Exemples Concrets

### **Collaborateurs Réels (Créés)**

```
┌─────────────────────────────────────────────────────────┐
│                    COLLABORATEURS                      │
├─────────────────────────────────────────────────────────┤
│ Marie Dupont    │ marie.dupont@satoripop.com   │ marie123  │
│ Jean Martin     │ jean.martin@satoripop.com    │ jean123   │
│ Sophie Bernard  │ sophie.bernard@satoripop.com │ sophie123 │
│ Pierre Durand   │ pierre.durand@satoripop.com  │ pierre123 │
│ Claire Moreau   │ claire.moreau@satoripop.com  │ claire123 │
└─────────────────────────────────────────────────────────┘
```

### **Administrateurs (Créés)**

```
┌─────────────────────────────────────────────────────────┐
│                   ADMINISTRATEURS                      │
├─────────────────────────────────────────────────────────┤
│ admin@satoripop.com     │ admin123                      │
│ directeur@satoripop.com │ directeur123                  │
│ manager@satoripop.com   │ manager123                    │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Logique de Détection Automatique

```javascript
const detectUserRole = (email) => {
  // 1. Emails administrateurs spécifiques
  const adminEmails = [
    'admin@satoripop.com', 
    'directeur@satoripop.com', 
    'manager@satoripop.com',
    'direction@satoripop.com',
    'chef@satoripop.com'
  ];
  
  // 2. Mots-clés administrateurs
  const adminKeywords = ['admin', 'directeur', 'manager', 'chef', 'direction'];
  
  // 3. Vérifications
  if (adminEmails.includes(email.toLowerCase())) return 'admin';
  if (adminKeywords.some(keyword => email.toLowerCase().includes(keyword))) return 'admin';
  
  // 4. Par défaut = collaborateur
  return 'collaborateur';
};
```

## 📝 Scénarios de Test

### **Scénario 1 : Collaborateur Normal**
```
Email: marie.dupont@satoripop.com
Password: marie123
Détection: collaborateur
Redirection: /accueil
Message: "Bienvenue Marie ! Bon retour sur Satoripop."
```

### **Scénario 2 : Administrateur Spécifique**
```
Email: admin@satoripop.com
Password: admin123
Détection: admin
Redirection: /admin
Message: "Bienvenue ! Accès administrateur activé."
```

### **Scénario 3 : Administrateur par Mot-clé**
```
Email: chef.equipe@satoripop.com
Password: [son mot de passe]
Détection: admin (mot-clé "chef")
Redirection: /admin
Message: "Bienvenue ! Accès administrateur activé."
```

## 🚀 Comment Tester

### **Test Collaborateur :**
1. Allez sur `http://localhost:5173/login`
2. Saisissez : `marie.dupont@satoripop.com` / `marie123`
3. Cliquez "Se connecter"
4. ✅ Vérifiez : Redirection vers `/accueil`

### **Test Administrateur :**
1. Allez sur `http://localhost:5173/login`
2. Saisissez : `admin@satoripop.com` / `admin123`
3. Cliquez "Se connecter"
4. ✅ Vérifiez : Redirection vers `/admin`

## 🔧 Pour Ajouter de Nouveaux Utilisateurs

### **Nouveau Collaborateur :**
1. **Inscription** via `/register` avec :
   - Email : `prenom.nom@satoripop.com`
   - Mot de passe : Au choix
   - Rôle : Automatiquement "collaborateur"

2. **Connexion** avec les mêmes identifiants

### **Nouvel Administrateur :**
1. **Option 1** : Email avec mot-clé admin
   - `admin.region@satoripop.com` → Détection automatique

2. **Option 2** : Ajouter l'email à la liste
   ```javascript
   const adminEmails = [
     'admin@satoripop.com',
     'nouveau.admin@satoripop.com' // Ajouter ici
   ];
   ```

## 💡 Avantages de ce Système

### **Pour les Collaborateurs :**
- ✅ **Simplicité** : Utilisent leur vraie adresse email
- ✅ **Familiarité** : Même email que l'inscription
- ✅ **Personnalisation** : Messages avec leur nom
- ✅ **Sécurité** : Pas d'email générique partagé

### **Pour les Administrateurs :**
- ✅ **Flexibilité** : Plusieurs emails admin possibles
- ✅ **Évolutivité** : Facile d'ajouter de nouveaux admins
- ✅ **Reconnaissance** : Détection par mots-clés
- ✅ **Hiérarchie** : Différents niveaux (admin, directeur, manager)

### **Pour le Système :**
- ✅ **Automatique** : Pas de sélection manuelle requise
- ✅ **Intelligent** : Détection basée sur l'email
- ✅ **Sécurisé** : Validation côté serveur
- ✅ **Maintenable** : Règles centralisées

## 🎯 Résumé

**Les collaborateurs** se connectent avec **leur propre adresse email** d'inscription :
- `marie.dupont@satoripop.com` / `marie123`
- Détection automatique → "collaborateur"
- Redirection → `/accueil`

**Les administrateurs** utilisent des emails spécifiques ou avec mots-clés :
- `admin@satoripop.com` / `admin123`
- Détection automatique → "admin"  
- Redirection → `/admin`

**Aucune configuration manuelle** requise ! 🚀
