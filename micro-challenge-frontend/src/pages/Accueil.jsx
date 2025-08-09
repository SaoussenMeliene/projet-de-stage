import React from "react";
import HeaderDashboard from "../components/HeaderDashboard";

import { Link } from 'react-router-dom';
import DashboardStatsAdvanced from "../components/DashboardStatsAdvanced";
import DefisRecentsModern from "../components/DefisRecentsModern";



const Accueil = () => {
  return (
    <div className="min-h-screen bg-[#f0f9f6]">
      <HeaderDashboard />

      {/* Hero */}
      <div className="px-8 pb-8 pt-6 animate-fadeUp">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-10 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Relevez des défis qui ont du sens</h1>
          <p className="mb-6 text-lg max-w-2xl">
            Participez chaque semaine à des micro-challenges solidaires, écologiques ou créatifs.
            Ensemble, créons un impact positif en seulement 15 minutes.
          </p>
          <Link
            to="/mes-defis"
            className="bg-yellow-400 text-gray-700 text-sm font-semibold rounded-full px-8 py-3 hover:bg-yellow-500 transition-transform transform hover:scale-105"
          >
            Commencer un défi →
          </Link>
        </div>
      </div>


     {/* Statistiques */}

<DashboardStatsAdvanced />


        {/* Défis récents */}
      
       {/* Grille des défis */}

   <DefisRecentsModern />
    </div>
 
  );
};

export default  Accueil ;