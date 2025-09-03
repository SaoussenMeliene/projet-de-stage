# Composant VideoModal - Guide d'utilisation

## Vue d'ensemble

Le composant `VideoModal` est un modal flexible qui permet d'afficher des vidéos de différentes sources :
- **YouTube** : Vidéos hébergées sur YouTube
- **Vimeo** : Vidéos hébergées sur Vimeo  
- **Local** : Vidéos hébergées sur votre serveur

## Fonctionnalités

✅ **Interface moderne** : Design responsive avec animations fluides
✅ **Multi-plateforme** : Support YouTube, Vimeo, et fichiers locaux
✅ **Accessibilité** : Fermeture par Echap, clic en dehors, bouton de fermeture
✅ **Performance** : Empêche le scroll de la page quand ouvert
✅ **Personnalisable** : Titre et description configurables

## Utilisation

### 1. Importation
```jsx
import VideoModal from '../components/VideoModal';
```

### 2. État pour contrôler la modal
```jsx
const [showVideoModal, setShowVideoModal] = useState(false);
```

### 3. Bouton pour ouvrir la modal
```jsx
<button onClick={() => setShowVideoModal(true)}>
  Voir la démonstration
</button>
```

### 4. Composant VideoModal

#### Vidéo YouTube
```jsx
<VideoModal
  isOpen={showVideoModal}
  onClose={() => setShowVideoModal(false)}
  videoUrl="https://www.youtube.com/embed/VOTRE_VIDEO_ID"
  videoType="youtube"
  title="Titre de votre vidéo"
  description="Description de votre vidéo"
/>
```

#### Vidéo Vimeo
```jsx
<VideoModal
  isOpen={showVideoModal}
  onClose={() => setShowVideoModal(false)}
  videoUrl="https://player.vimeo.com/video/VOTRE_VIDEO_ID"
  videoType="vimeo"
  title="Titre de votre vidéo"
  description="Description de votre vidéo"
/>
```

#### Vidéo locale
```jsx
<VideoModal
  isOpen={showVideoModal}
  onClose={() => setShowVideoModal(false)}
  videoUrl="/videos/demo.mp4"
  videoType="local"
  title="Titre de votre vidéo"
  description="Description de votre vidéo"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | **Requis** - Contrôle l'affichage de la modal |
| `onClose` | function | - | **Requis** - Fonction appelée à la fermeture |
| `videoUrl` | string | - | **Requis** - URL de la vidéo |
| `videoType` | string | 'youtube' | Type de vidéo: 'youtube', 'vimeo', ou 'local' |
| `title` | string | 'Vidéo de démonstration' | Titre affiché sous la vidéo |
| `description` | string | 'Découvrez notre plateforme en action' | Description affichée sous la vidéo |

## Comment obtenir les URLs

### YouTube
1. Aller sur votre vidéo YouTube
2. Cliquer sur "Partager" → "Intégrer"
3. Dans l'iframe, récupérer l'URL qui ressemble à : `https://www.youtube.com/embed/VIDEO_ID`

### Vimeo
1. Aller sur votre vidéo Vimeo
2. Cliquer sur "Partager" → "Intégrer"
3. Dans l'iframe, récupérer l'URL qui ressemble à : `https://player.vimeo.com/video/VIDEO_ID`

### Vidéos locales
1. Placer votre fichier vidéo dans le dossier `/public/videos/`
2. Utiliser l'URL relative : `/videos/nom-de-votre-fichier.mp4`
3. Formats supportés : MP4, WebM

## Contrôles utilisateur

- **Clic en dehors** : Ferme la modal
- **Touche Echap** : Ferme la modal
- **Bouton X** : Ferme la modal
- **Autoplay** : La vidéo démarre automatiquement (YouTube/Vimeo)
- **Contrôles** : Contrôles natifs pour les vidéos locales

## Exemple complet

```jsx
import React, { useState } from 'react';
import { Play } from 'lucide-react';
import VideoModal from '../components/VideoModal';

const HomePage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div>
      {/* Bouton de démonstration */}
      <button 
        onClick={() => setShowVideoModal(true)}
        className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
      >
        <Play size={20} />
        Voir la démonstration
      </button>

      {/* Modal vidéo */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
        videoType="youtube"
        title="Démonstration de notre plateforme"
        description="Découvrez comment notre solution révolutionne l'engagement des équipes."
      />
    </div>
  );
};
```

## Personnalisation

Le composant utilise Tailwind CSS. Vous pouvez personnaliser :
- Les couleurs du gradient de description
- La taille maximum de la modal
- Les effets de transition
- L'apparence du bouton de fermeture

Pour modifier le style, éditez directement le fichier `VideoModal.jsx`.