import { Users, Calendar } from "lucide-react";

export default function ActiveChallenges() {
  const challenges = [
    {
      title: "Défi zéro déchet d'une semaine",
      description: "Réduisez vos déchets au maximum pendant une semaine complète.",
      category: "Écologique",
      status: "En cours",
      days: 7,
      progress: 65,
      participants: 8,
      date: "20 Jan - 27 Jan",
      color: "green",
    },
    {
      title: "Création d'un mur d'expression",
      description: "Concevez un mur créatif pour égayer l'espace commun.",
      category: "Créatif",
      status: "En cours",
      days: 8,
      progress: 30,
      participants: 5,
      date: "25 Jan - 1 Fév",
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {challenges.map((challenge, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 border-l-4"
          style={{ borderColor: challenge.color }}
        >
          {/* Badges */}
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full bg-${challenge.color}-500`}>
              {challenge.category}
            </span>
            <span className="text-gray-500 text-sm">{challenge.days} jours</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-1">{challenge.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{challenge.description}</p>

          {/* Progression */}
          <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
            <span>Progression</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div className="h-2 rounded-full bg-green-500" style={{ width: `${challenge.progress}%` }}></div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
            <span className="flex items-center gap-1"><Users size={16}/> {challenge.participants} participants</span>
            <span className="flex items-center gap-1"><Calendar size={16}/> {challenge.date}</span>
          </div>

          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
            Continuer
          </button>
        </div>
      ))}
    </div>
  );
}
