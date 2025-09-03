import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Composant Modal Vidéo flexible
 * Supports YouTube, Vimeo, et vidéos locales
 */
const VideoModal = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  videoType = 'youtube', // 'youtube', 'vimeo', 'local'
  title = "Vidéo de démonstration",
  description = "Découvrez notre plateforme en action"
}) => {
  
  // Gestion de la touche Echap et scroll
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Génération du contenu vidéo selon le type
  const renderVideoContent = () => {
    switch (videoType) {
      case 'youtube':
        return (
          <iframe
            width="100%"
            height="100%"
            src={`${videoUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        );
      
      case 'vimeo':
        return (
          <iframe
            width="100%"
            height="100%"
            src={`${videoUrl}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        );
      
      case 'local':
        return (
          <video
            width="100%"
            height="100%"
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        );
      
      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
            <p>Type de vidéo non supporté</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl mx-4 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10 bg-black/50 rounded-full p-2"
          aria-label="Fermer la vidéo"
        >
          <X size={24} />
        </button>
        
        {/* Conteneur vidéo */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
          <div className="aspect-video">
            {renderVideoContent()}
          </div>
          
          {/* Titre et description */}
          <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
            <h3 className="text-2xl font-bold mb-2">
              {title}
            </h3>
            <p className="text-purple-100">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;