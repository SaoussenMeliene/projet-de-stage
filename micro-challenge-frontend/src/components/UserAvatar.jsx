import React from 'react';

/**
 * Composant Avatar utilisateur avec initiales
 * Génère un avatar coloré basé sur le nom de l'utilisateur
 */
const UserAvatar = ({
  name,
  email,
  profileImage = null,
  size = 'md',
  className = '',
  showBorder = true
}) => {
  // Tailles disponibles
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  // Générer les initiales
  const getInitials = (name, email) => {
    // Forcer "Ad" pour les admins
    if (email === 'admin@satoripop.com' || name === 'Admin') {
      return 'Ad';
    }
    
    if (name && name !== 'Chargement...') {
      const nameParts = name.trim().split(' ');
      if (nameParts.length >= 2) {
        return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    
    if (email) {
      const emailPart = email.split('@')[0];
      return emailPart.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  };

  // Générer une couleur basée sur le nom/email
  const getAvatarColor = (text) => {
    const colors = [
      'bg-gradient-to-br from-blue-400 to-blue-600',
      'bg-gradient-to-br from-green-400 to-green-600',
      'bg-gradient-to-br from-purple-400 to-purple-600',
      'bg-gradient-to-br from-pink-400 to-pink-600',
      'bg-gradient-to-br from-indigo-400 to-indigo-600',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
      'bg-gradient-to-br from-red-400 to-red-600',
      'bg-gradient-to-br from-teal-400 to-teal-600',
      'bg-gradient-to-br from-orange-400 to-orange-600',
      'bg-gradient-to-br from-cyan-400 to-cyan-600'
    ];

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name, email);
  const colorClass = getAvatarColor(name || email || 'default');
  const sizeClass = sizes[size] || sizes.md;
  const borderClass = showBorder ? 'border-2 border-white shadow-sm' : '';

  // Avatar spécial pour l'admin
  if (email === 'admin@satoripop.com' && name === 'Admin') {
    return (
      <div
        className={`
          ${sizeClass}
          bg-gradient-to-br from-amber-400 to-orange-600
          ${borderClass}
          ${className}
          rounded-full
          flex
          items-center
          justify-center
          text-white
          font-semibold
          select-none
          relative
        `}
        title={name || email}
      >
        Ad
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
      </div>
    );
  }

  // Si une image de profil est fournie, l'afficher
  if (profileImage && profileImage !== '/admin-avatar.png') {
    const imageUrl = profileImage.startsWith('http') ? profileImage : `http://localhost:5000${profileImage}`;
    console.log("🖼️ Affichage de l'image de profil:", {
      profileImage,
      imageUrl,
      name,
      email
    });

    return (
      <img
        src={imageUrl}
        alt={name || email}
        className={`
          ${sizeClass}
          ${borderClass}
          ${className}
          rounded-full
          object-cover
          select-none
        `}
        title={name || email}
        onError={(e) => {
          console.error("❌ Erreur de chargement de l'image:", imageUrl);
          e.target.style.display = 'none';
        }}
        onLoad={() => {
          console.log("✅ Image chargée avec succès:", imageUrl);
        }}
      />
    );
  }

  // Sinon, afficher l'avatar avec initiales
  return (
    <div
      className={`
        ${sizeClass}
        ${colorClass}
        ${borderClass}
        ${className}
        rounded-full
        flex
        items-center
        justify-center
        text-white
        font-semibold
        select-none
      `}
      title={name || email}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
