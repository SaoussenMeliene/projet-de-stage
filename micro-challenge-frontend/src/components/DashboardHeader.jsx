import { Search, Bell } from "react-feather";
import { Link } from "react-router-dom";

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-sm">
      {/* Logo et titre */}
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
        <div>
         
          <span className="text-xl text-gray-600">Challenges</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 flex justify-center mx-4">
        <div className="flex items-center w-full max-w-lg bg-yellow-400 rounded-full px-4 py-1.5">
          <Search className="text-gray-700 mr-2" size={18} />
          <input
            type="text"
            placeholder="Rechercher un défi..."
            className="bg-transparent outline-none flex-1 placeholder-gray-700 text-gray-900 text-sm"
          />
        </div>
      </div>

      {/* Icônes notifications et profil */}
      <div className="flex items-center space-x-4">
        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
          <span className="text-gray-300 text-lg">★</span>
        </div>
        <div className="relative cursor-pointer">
          <Bell size={18} className="text-gray-700" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
            3
          </span>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
