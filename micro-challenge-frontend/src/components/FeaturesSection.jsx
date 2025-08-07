import React from "react";
import { FaBullseye, FaComments, FaMedal, FaCheckCircle } from "react-icons/fa";

const features = [
  {
    icon: FaBullseye,
    color: "from-purple-500 to-blue-500", // Pour le gradient
    title: "Défis Collaboratifs",
    description:
      "Participez à des micro-challenges stimulants avec vos collègues et développez vos compétences",
  },
  {
    icon: FaComments,
    color: "from-green-500 to-green-500", // Couleur unie
    title: "Discussions en Groupe",
    description:
      "Échangez et collaborez dans des espaces dédiés à chaque défi avec vos équipes",
  },
  {
    icon: FaMedal,
    color: "from-orange-500 to-orange-500",
    title: "Système de Récompenses",
    description:
      "Gagnez des points et des badges en validant vos participations et réalisations",
  },
  {
    icon: FaCheckCircle,
    color: "from-purple-500 to-pink-500",
    title: "Validation Administrative",
    description:
      "Processus rigoureux de validation des preuves par les administrateurs qualifiés",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1B1A2F] mb-4">
            Une plateforme complète pour vos défis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez toutes les fonctionnalités qui font de Satoripop Challenges
            l'outil idéal pour renforcer la collaboration et l'engagement de vos équipes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="group">
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-2 h-full">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1B1A2F] mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
