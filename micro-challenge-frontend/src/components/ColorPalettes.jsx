// Différentes palettes de couleurs pour les défis

export const colorPalettes = {
  // Palette 1: Moderne & Professionnelle (ACTUELLE)
  modern: {
    solidaire: {
      gradient: "from-blue-500 to-indigo-600",
      bg: "from-blue-50 to-indigo-50"
    },
    ecologique: {
      gradient: "from-emerald-500 to-teal-600", 
      bg: "from-emerald-50 to-teal-50"
    },
    creatif: {
      gradient: "from-purple-500 to-violet-600",
      bg: "from-purple-50 to-violet-50"
    }
  },

  // Palette 2: Vibrant & Énergique
  vibrant: {
    solidaire: {
      gradient: "from-rose-500 to-pink-600",
      bg: "from-rose-50 to-pink-50"
    },
    ecologique: {
      gradient: "from-lime-500 to-green-600",
      bg: "from-lime-50 to-green-50"
    },
    creatif: {
      gradient: "from-orange-500 to-red-500",
      bg: "from-orange-50 to-red-50"
    }
  },

  // Palette 3: Douce & Pastel
  pastel: {
    solidaire: {
      gradient: "from-sky-400 to-blue-500",
      bg: "from-sky-50 to-blue-50"
    },
    ecologique: {
      gradient: "from-emerald-400 to-green-500",
      bg: "from-emerald-50 to-green-50"
    },
    creatif: {
      gradient: "from-violet-400 to-purple-500",
      bg: "from-violet-50 to-purple-50"
    }
  },

  // Palette 4: Sombre & Élégante
  dark: {
    solidaire: {
      gradient: "from-slate-600 to-gray-700",
      bg: "from-slate-50 to-gray-50"
    },
    ecologique: {
      gradient: "from-emerald-600 to-green-700",
      bg: "from-emerald-50 to-green-50"
    },
    creatif: {
      gradient: "from-indigo-600 to-purple-700",
      bg: "from-indigo-50 to-purple-50"
    }
  },

  // Palette 5: Sunset & Warm
  sunset: {
    solidaire: {
      gradient: "from-amber-500 to-orange-600",
      bg: "from-amber-50 to-orange-50"
    },
    ecologique: {
      gradient: "from-teal-500 to-cyan-600",
      bg: "from-teal-50 to-cyan-50"
    },
    creatif: {
      gradient: "from-fuchsia-500 to-pink-600",
      bg: "from-fuchsia-50 to-pink-50"
    }
  },

  // Palette 6: Ocean & Fresh
  ocean: {
    solidaire: {
      gradient: "from-cyan-500 to-blue-600",
      bg: "from-cyan-50 to-blue-50"
    },
    ecologique: {
      gradient: "from-green-500 to-emerald-600",
      bg: "from-green-50 to-emerald-50"
    },
    creatif: {
      gradient: "from-indigo-500 to-purple-600",
      bg: "from-indigo-50 to-purple-50"
    }
  }
};

// Fonction pour appliquer une palette
export const applyPalette = (paletteName) => {
  const palette = colorPalettes[paletteName];
  if (!palette) return colorPalettes.modern;
  
  return [
    {
      category: "Solidaire",
      categoryGradient: palette.solidaire.gradient,
      categoryBg: palette.solidaire.bg,
    },
    {
      category: "Écologique", 
      categoryGradient: palette.ecologique.gradient,
      categoryBg: palette.ecologique.bg,
    },
    {
      category: "Créatif",
      categoryGradient: palette.creatif.gradient,
      categoryBg: palette.creatif.bg,
    }
  ];
};
