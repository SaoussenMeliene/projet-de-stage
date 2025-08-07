import { Users, Target, Award, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardStats() {
  const [animatedValues, setAnimatedValues] = useState([0, 0, 0, 0]);

  const stats = [
    {
      icon: Users,
      value: 247,
      label: "Participants actifs",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      change: "+12%",
      changeType: "positive"
    },
    {
      icon: Target,
      value: 156,
      label: "Défis réalisés",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      change: "+8%",
      changeType: "positive"
    },
    {
      icon: Award,
      value: 89,
      label: "Badges débloqués",
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-100",
      change: "+15%",
      changeType: "positive"
    },
    {
      icon: Calendar,
      value: 12,
      label: "Défis cette semaine",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      change: "+3",
      changeType: "positive"
    },
  ];

  // Animation des valeurs au chargement
  useEffect(() => {
    const targetValues = [247, 156, 89, 12];
    const timers = targetValues.map((targetValue, index) => {
      return setTimeout(() => {
        let current = 0;
        const increment = targetValue / 30;
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
        }, 50);
      }, index * 200);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`relative bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group cursor-pointer overflow-hidden`}
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Effet de brillance au hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {/* Header avec icône et changement */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="text-white w-7 h-7" />
              </div>

              <div className="flex items-center space-x-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                <TrendingUp size={12} />
                <span>{stat.change}</span>
              </div>
            </div>

            {/* Valeur principale */}
            <div className="mb-2">
              <p className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                {animatedValues[index]}
              </p>
            </div>

            {/* Label */}
            <p className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              {stat.label}
            </p>

            {/* Indicateur de progression */}
            <div className="mt-4 w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{
                  width: `${(animatedValues[index] / stat.value) * 100}%`
                }}
              ></div>
            </div>

            {/* Icône de flèche en bas à droite */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="text-gray-400 w-4 h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Styles CSS pour l'animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
