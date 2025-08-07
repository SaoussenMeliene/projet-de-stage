import React from "react";
import { CheckCircle } from "react-feather";
import { FaBolt } from "react-icons/fa";

const WhyChoose = () => {
  const benefits = [
    "Renforcez l'esprit d'équipe",
    "Gagnez des récompenses",
    "Créez des liens durables",
    "Développez vos compétences",
    "Participez à l'innovation",
    "Relevez des défis stimulants",
  ];

  const steps = [
    { num: 1, color: "bg-blue-500", text: "Connectez-vous avec vos identifiants" },
    { num: 2, color: "bg-purple-500", text: "Choisissez vos défis préférés" },
    { num: 3, color: "bg-green-500", text: "Participez et gagnez des récompenses" },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Partie gauche : Pourquoi choisir */}
        <div>
          <h2 className="text-3xl font-bold text-[#1B1A2F] mb-4">
            Pourquoi choisir Satoripop Challenges ?
          </h2>
          <p className="text-gray-600 mb-6">
            Notre plateforme transforme la collaboration en aventure passionnante,
            où chaque défi relevé renforce l'esprit d'équipe et développe les compétences.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={18} />
                <span className="text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partie droite : Démarrez en 3 étapes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border border-gray-100">
          <div className="bg-green-500 w-12 h-12 flex items-center justify-center rounded-full mb-4 shadow-md">
            <FaBolt className="text-white" size={20} />
          </div>
          <h3 className="text-xl font-bold text-[#1B1A2F] mb-6">Démarrez en 3 étapes</h3>
          <ul className="space-y-4 w-full">
            {steps.map((s, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <div
                  className={`${s.color} w-8 h-8 flex items-center justify-center rounded-full text-white font-bold`}
                >
                  {s.num}
                </div>
                <span className="text-gray-700">{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
