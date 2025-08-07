import React from 'react';
import { Loader } from 'lucide-react';

/**
 * Composant de chargement réutilisable
 * Améliore l'expérience utilisateur pendant les chargements
 */
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Chargement...', 
  className = '',
  color = 'text-purple-500' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="flex items-center gap-3">
        <Loader className={`${sizeClasses[size]} animate-spin ${color}`} />
        {text && <span className="text-gray-600">{text}</span>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
