import React from "react";
import { Heart, Leaf, Palette } from "lucide-react";
import { colorPalettes } from "./ColorPalettes";

export default function ColorDemo() {
  const categories = [
    { name: "Solidaire", icon: Heart, key: "solidaire" },
    { name: "Écologique", icon: Leaf, key: "ecologique" },
    { name: "Créatif", icon: Palette, key: "creatif" }
  ];

  const paletteNames = {
    modern: "🏢 Moderne & Professionnelle",
    vibrant: "⚡ Vibrant & Énergique", 
    pastel: "🌸 Douce & Pastel",
    dark: "🖤 Sombre & Élégante",
    sunset: "🌅 Sunset & Warm",
    ocean: "🌊 Ocean & Fresh"
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎨 Palettes de Couleurs Disponibles
        </h1>
        
        <div className="space-y-12">
          {Object.entries(colorPalettes).map(([paletteName, palette]) => (
            <div key={paletteName} className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-700">
                {paletteNames[paletteName]}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const colors = palette[category.key];
                  return (
                    <div key={category.key} className="relative group">
                      {/* Carte de démonstration */}
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                        {/* Header coloré */}
                        <div className={`h-32 bg-gradient-to-br ${colors.gradient} relative`}>
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="absolute top-4 left-4">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                              <category.icon className="text-white w-5 h-5" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                              Démo
                            </span>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${colors.gradient} text-white`}>
                              {category.name}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold text-sm mb-2 text-gray-800">
                            Défi {category.name.toLowerCase()}
                          </h3>
                          
                          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                            Exemple de description pour un défi de catégorie {category.name.toLowerCase()}.
                          </p>
                          
                          {/* Barre de progression */}
                          <div className="mb-3">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                                style={{ width: '60%' }}
                              ></div>
                            </div>
                          </div>
                          
                          <button className={`w-full bg-gradient-to-r ${colors.gradient} text-white font-medium py-2 rounded-xl text-xs transition-all duration-300 hover:shadow-md`}>
                            Participer
                          </button>
                        </div>
                      </div>
                      
                      {/* Codes couleurs */}
                      <div className="mt-3 text-center">
                        <div className="text-xs text-gray-500 font-mono">
                          <div>Gradient: {colors.gradient}</div>
                          <div>Background: {colors.bg}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Comment changer de palette ?
          </h3>
          <p className="text-blue-600 text-sm">
            Dites-moi quelle palette vous préférez et je l'appliquerai immédiatement ! 
            <br />
            Par exemple : "J'aime la palette Vibrant & Énergique" ou "Applique la palette Ocean & Fresh"
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
