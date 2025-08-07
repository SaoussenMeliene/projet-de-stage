# 🔍 Diagnostic du Problème de Connexion

## ✅ **Ce qui Fonctionne**

1. **Backend** : ✅ Serveur sur http://localhost:5000
2. **Base de données** : ✅ Utilisateurs créés et vérifiés
3. **Mot de passe** : ✅ Hash correct et vérifiable
4. **Frontend** : ✅ Page de login accessible

## 🔍 **Étapes de Diagnostic**

### **Étape 1 : Vérifier la Console du Navigateur**

1. **Ouvrez la page de login** : http://localhost:5173/login
2. **Ouvrez les outils de développement** : F12
3. **Allez dans l'onglet Console**
4. **Saisissez** : `marie.dupont@satoripop.com` / `marie123`
5. **Cliquez "Se connecter"**
6. **Vérifiez les erreurs** dans la console

### **Étape 2 : Vérifier l'Onglet Network**

1. **Ouvrez l'onglet Network** dans les outils de développement
2. **Tentez une connexion**
3. **Vérifiez** :
   - ✅ Requête POST vers `http://localhost:5000/api/auth/login`
   - ✅ Status Code (200 = succès, 400/500 = erreur)
   - ✅ Réponse du serveur

### **Étape 3 : Problèmes Possibles**

#### **A. Serveur Backend Non Démarré**
```bash
# Vérifiez si le serveur fonctionne
curl http://localhost:5000
# Ou ouvrez dans le navigateur
```

**Solution :**
```bash
cd micro-challenges-backend
node server.js
```

#### **B. Problème CORS**
**Erreur typique :** `Access to XMLHttpRequest blocked by CORS policy`

**Solution :** Vérifier que le backend a :
```javascript
app.use(cors());
```

#### **C. URL d'API Incorrecte**
**Vérifiez dans LoginPagePro.jsx :**
```javascript
await axios.post("http://localhost:5000/api/auth/login", formData);
```

#### **D. Données Envoyées Incorrectes**
**Vérifiez le payload :**
```javascript
{
  "email": "marie.dupont@satoripop.com",
  "password": "marie123",
  "expectedRole": "collaborateur"
}
```

#### **E. Problème de Validation**
**Erreurs possibles :**
- Email invalide (validation côté client)
- Mot de passe trop court
- Champs manquants

## 🛠️ **Solutions Rapides**

### **Solution 1 : Test Manuel de l'API**

Testez directement l'API avec curl :
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "marie.dupont@satoripop.com",
    "password": "marie123",
    "expectedRole": "collaborateur"
  }'
```

### **Solution 2 : Vérifier les Logs Backend**

Dans le terminal du backend, vérifiez :
```
📥 Requête de login reçue: { email: '...', password: '...' }
✅ Utilisateur trouvé
✅ Mot de passe correct
```

### **Solution 3 : Redémarrer les Services**

```bash
# Terminal 1 : Backend
cd micro-challenges-backend
node server.js

# Terminal 2 : Frontend  
cd micro-challenge-frontend
npm run dev
```

### **Solution 4 : Vérifier la Configuration Axios**

Dans `LoginPagePro.jsx`, vérifiez :
```javascript
// URL correcte
const response = await axios.post("http://localhost:5000/api/auth/login", {
  ...formData,
  expectedRole: roleToUse
});
```

## 🎯 **Test Étape par Étape**

### **1. Test Backend Seul**
```bash
# Dans micro-challenges-backend
node testLoginAPI.js
```

### **2. Test Frontend Seul**
1. Ouvrir http://localhost:5173/login
2. Ouvrir Console (F12)
3. Taper : `marie.dupont@satoripop.com` / `marie123`
4. Observer les logs

### **3. Test Complet**
1. Backend démarré ✅
2. Frontend démarré ✅
3. Connexion test ✅

## 📋 **Checklist de Vérification**

- [ ] Backend sur port 5000 accessible
- [ ] Frontend sur port 5173 accessible  
- [ ] Utilisateur existe dans la base de données
- [ ] Mot de passe correct
- [ ] Pas d'erreurs CORS
- [ ] Requête POST envoyée
- [ ] Réponse reçue du serveur
- [ ] Token stocké
- [ ] Redirection effectuée

## 🚨 **Erreurs Communes**

### **Erreur 1 : "Network Error"**
- **Cause** : Backend non démarré
- **Solution** : `node server.js`

### **Erreur 2 : "CORS Error"**
- **Cause** : Configuration CORS manquante
- **Solution** : Ajouter `app.use(cors())` dans server.js

### **Erreur 3 : "Email incorrect"**
- **Cause** : Utilisateur non trouvé en base
- **Solution** : Vérifier avec le script de test

### **Erreur 4 : "Mot de passe incorrect"**
- **Cause** : Hash du mot de passe incorrect
- **Solution** : Recréer l'utilisateur

### **Erreur 5 : Pas de redirection**
- **Cause** : Token non stocké ou navigation échouée
- **Solution** : Vérifier le localStorage/sessionStorage

## 🎯 **Prochaines Étapes**

1. **Suivez le diagnostic étape par étape**
2. **Identifiez l'erreur exacte**
3. **Appliquez la solution correspondante**
4. **Testez à nouveau**

**Si le problème persiste, partagez :**
- Messages d'erreur de la console
- Logs du serveur backend
- Status code de la requête HTTP
