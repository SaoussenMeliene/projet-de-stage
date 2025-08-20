# Système de Notifications en Temps Réel

## 📋 Vue d'ensemble

Le système de notifications a été implémenté pour informer automatiquement les collaborateurs lorsque :
1. **Un admin approuve une preuve** → Notification à l'utilisateur concerné
2. **Un admin rejette une preuve** → Notification à l'utilisateur concerné  
3. **Un nouveau défi est créé** → Notification à tous les collaborateurs

## 🏗️ Architecture

### Backend
- **Modèle** : `Models/Notification.js` - Structure des notifications
- **Contrôleur** : `Controllers/notification.controller.js` - Gestion des notifications
- **Routes** : `Routes/notification.routes.js` - API endpoints
- **Intégration** : Notifications automatiques dans `proof.controller.js` et `challenge.controller.js`

### Frontend
- **Service** : `services/notificationService.js` - API calls
- **Hook** : `hooks/useNotifications.js` - Gestion d'état React
- **Composant** : `HeaderDashboard.jsx` - Icône de notifications avec dropdown
- **Page de test** : `pages/TestNotifications.jsx` - Interface de test

## 🔧 Fonctionnalités

### Notifications automatiques
- ✅ **Approbation de preuve** : "Preuve approuvée ! Votre preuve pour le défi 'X' a été approuvée. Félicitations !"
- ✅ **Rejet de preuve** : "Preuve rejetée. Votre preuve pour le défi 'X' a été rejetée. [Commentaire]"
- ✅ **Nouveau défi** : "Nouveau défi disponible ! Un nouveau défi 'X' vient d'être ajouté. Découvrez-le maintenant !"

### Interface utilisateur
- ✅ **Icône avec compteur** : Badge rouge avec nombre de notifications non lues
- ✅ **Dropdown interactif** : Liste des notifications avec icônes colorées
- ✅ **Marquer comme lu** : Clic sur une notification pour la marquer comme lue
- ✅ **Marquer tout comme lu** : Bouton pour marquer toutes les notifications
- ✅ **Actualisation** : Bouton pour recharger les notifications
- ✅ **Polling automatique** : Vérification toutes les 30 secondes

## 📡 API Endpoints

```
GET    /api/notifications          - Récupérer les notifications de l'utilisateur
PATCH  /api/notifications/:id/read - Marquer une notification comme lue
```

## 🧪 Tests

### Scripts de test disponibles
1. **`test-notifications.js`** - Créer des notifications de test
2. **`test-challenge-notification.js`** - Tester la création de défi avec notifications

### Page de test frontend
- URL : `http://localhost:5174/test-notifications`
- Interface complète pour tester toutes les fonctionnalités

## 🚀 Utilisation

### 1. Démarrer les serveurs
```bash
# Backend
cd micro-challenges-backend
npm start

# Frontend  
cd micro-challenge-frontend
npm run dev
```

### 2. Créer des notifications de test
```bash
cd micro-challenges-backend
node test-notifications.js
```

### 3. Tester la création de défi
```bash
cd micro-challenges-backend
node test-challenge-notification.js
```

### 4. Accéder à l'interface
- **Dashboard** : `http://localhost:5174/accueil` (icône cloche en haut à droite)
- **Page de test** : `http://localhost:5174/test-notifications`

## 🎨 Types de notifications et icônes

| Type | Icône | Couleur | Déclencheur |
|------|-------|---------|-------------|
| Preuve approuvée | ✅ Award | Vert | Admin approuve une preuve |
| Preuve rejetée | ❌ X | Rouge | Admin rejette une preuve |
| Nouveau défi | ➕ Plus | Bleu | Admin crée un nouveau défi |
| Générique | 🔔 Bell | Gris | Autres notifications |

## 🔄 Flux de données

### Approbation/Rejet de preuve
1. Admin utilise `proofService.approveProof()` ou `rejectProof()`
2. Backend met à jour la preuve dans `proof.controller.js`
3. Backend crée automatiquement une notification pour l'utilisateur
4. Frontend récupère les nouvelles notifications via polling ou actualisation manuelle
5. Utilisateur voit la notification dans l'icône cloche

### Création de nouveau défi
1. Admin crée un défi via l'interface admin
2. Backend crée le défi dans `challenge.controller.js`
3. Backend crée automatiquement des notifications pour tous les collaborateurs
4. Tous les collaborateurs voient la notification dans leur icône cloche

## 🛠️ Configuration

### Polling interval
Modifiable dans `hooks/useNotifications.js` :
```javascript
const interval = setInterval(() => {
  loadNotifications();
}, 30000); // 30 secondes
```

### Styles des notifications
Personnalisables dans `HeaderDashboard.jsx` avec les classes Tailwind CSS.

## 🐛 Dépannage

### Notifications ne s'affichent pas
1. Vérifier que l'utilisateur est connecté
2. Vérifier les logs du serveur backend
3. Ouvrir les DevTools et vérifier les appels API
4. Utiliser la page de test : `/test-notifications`

### Erreurs API
- Vérifier que les routes notifications sont bien montées dans `server.js`
- Vérifier l'authentification (token JWT)
- Vérifier la structure de la base de données

## 📈 Améliorations futures

- [ ] **WebSockets** : Notifications en temps réel sans polling
- [ ] **Push notifications** : Notifications navigateur même quand l'onglet est fermé
- [ ] **Emails** : Notifications par email pour les événements importants
- [ ] **Préférences** : Permettre aux utilisateurs de configurer leurs notifications
- [ ] **Historique** : Page dédiée à l'historique complet des notifications
- [ ] **Catégories** : Filtrer les notifications par type/catégorie