import { Users, Target, Award, Calendar, TrendingUp, ArrowUpRight, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardStatsAdvanced() {
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  
  const stats = [
    { 
      icon: Users, 
      value: 247, 
      label: "Participants actifs", 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: "+12%",
      changeType: "positive",
      sparkline: [20, 25, 22, 30, 28, 35, 40],
      description: "Nouveaux cette semaine"
    },
    { 
      icon: Target, 
      value: 156, 
      label: "Défis réalisés", 
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      change: "+8%",
      changeType: "positive",
      sparkline: [15, 18, 20, 25, 22, 28, 30],
      description: "Ce mois-ci"
    },
    { 
      icon: Award, 
      value: 89, 
      label: "Badges débloqués", 
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50",
      change: "+15%",
      changeType: "positive",
      sparkline: [10, 12, 15, 18, 20, 25, 28],
      description: "Récompenses gagnées"
    },
    { 
      icon: Calendar, 
      value: 12, 
      label: "Défis cette semaine", 
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      change: "+3",
      changeType: "positive",
      sparkline: [2, 3, 4, 5, 7, 9, 12],
      description: "Objectif: 15"
    },
  ];

  // Animation des valeurs au chargement
  useEffect(() => {
    setIsVisible(true);
    const targetValues = [247, 156, 89, 12];
    const timers = targetValues.map((targetValue, index) => {
      return setTimeout(() => {
        let current = 0;
        const increment = targetValue / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= targetValue) {
            current = targetValue;
            clearInterval(timer);
          }
          setAnimatedValues(prev => {
            const newValues = [...prev];
            newValues[index] = Math.floor(current);
            return newValues;
          });
        }, 40);
      }, index * 150);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Composant mini-graphique
  const MiniSparkline = ({ data, gradient }) => {
    const max = Math.max(...data);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - (value / max) * 15;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="opacity-70">
        <defs>
          <linearGradient id={`gradient-${gradient}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={`url(#gradient-${gradient})`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 hover:scale-105 group cursor-pointer overflow-hidden border border-gray-100 ${
              isVisible ? 'animate-slideInUp' : 'opacity-0 translate-y-8'
            }`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            {/* Effet de brillance animé */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500"></div>
            
            {/* Gradient de fond subtil */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-30 rounded-3xl`}></div>
            
            {/* Contenu principal */}
            <div className="relative z-10">
              {/* Header avec icône et mini-graphique */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <stat.icon className="text-white w-8 h-8" />
                </div>
                
                <div className="text-right">
                  <MiniSparkline data={stat.sparkline} gradient={index} />
                  <div className="flex items-center space-x-1 text-green-600 text-xs font-semibold mt-1">
                    <TrendingUp size={10} />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>

              {/* Valeur principale avec animation */}
              <div className="mb-3">
                <p className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-300">
                  {animatedValues[index]}
                </p>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {stat.description}
                </p>
              </div>

              {/* Label principal */}
              <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300 mb-4">
                {stat.label}
              </p>

              {/* Barre de progression moderne */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1500 ease-out relative`}
                    style={{
                      width: `${(animatedValues[index] / stat.value) * 100}%`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>{stat.value}</span>
                </div>
              </div>
            </div>

            {/* Icône d'action en bas à droite */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="text-gray-600 w-4 h-4" />
              </div>
            </div>

            {/* Effet de bordure au hover */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${stat.gradient} p-[1px]`}>
              <div className="w-full h-full bg-white rounded-3xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
