import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-[#0f172a] to-[#2e1065] text-white py-20 px-6 text-center relative overflow-hidden">
      {/* Effet lumineux subtil */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20"></div>

      <div className="relative max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Prêt à relever le défi ?
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-8 leading-relaxed">
          Rejoignez vos collègues et participez aux micro-challenges SatoriPop.
          Renforcez l'esprit d'équipe tout en développant vos compétences
          dans un environnement stimulant.
        </p>

        {/* Bouton avec Glow + Animation pulsante */}
        <Link
          to="/register"
          className="relative inline-flex items-center space-x-2 px-12 py-4 
                     rounded-full text-lg font-bold text-white bg-green-500 
                     hover:bg-green-600 transition-all duration-200 
                     shadow-lg hover:shadow-xl group
                     before:absolute before:inset-0 before:rounded-full 
                     before:bg-green-500/50 before:blur-2xl
                     before:animate-ping before:opacity-60"
        >
          <span>Commencer l'aventure</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;

