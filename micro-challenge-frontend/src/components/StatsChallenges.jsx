import { Users, Target, Medal, Calendar } from "lucide-react";

export default function StatsChallenges() {
  const stats = [
    { icon: Users, value: 247, label: "Participants actifs", color: "bg-blue-500" },
    { icon: Target, value: 156, label: "Défis réalisés", color: "bg-green-500" },
    { icon: Medal, value: 89, label: "Badges débloqués", color: "bg-blue-400" },
    { icon: Calendar, value: 12, label: "Défis cette semaine", color: "bg-purple-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 text-center w-full max-w-[220px]"
        >
          {/* Icône centrée dans un cercle */}
          <div className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.color} mb-3`}>
            <stat.icon className="text-white w-6 h-6" />
          </div>

          <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
