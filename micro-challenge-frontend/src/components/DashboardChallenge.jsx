import { Search, Filter, Grid, List, Plus } from "lucide-react";

export default function DashboardChallenge() {
  return (
    <div className="bg-[#f0f9f6] px-6 py-6 rounded-md ">
      {/* Header Title */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord des défis</h1>
          
          <p className="text-gray-500 text-sm">
            Gérez vos défis en cours et découvrez de nouveaux challenges à relever.
          </p>
        </div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <Plus size={18}/> Proposer un défi
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap items-center gap-6 mt-6">
  {/* Barre de recherche jaune agrandie */}
  <div className="flex items-center bg-yellow-400 rounded-full px-5 py-3 w-full md:w-3/5">
    <Search className="text-gray-700 mr-3"/>
    <input
      type="text"
      placeholder="Rechercher un défi..."
      className="bg-transparent outline-none w-full text-gray-800 placeholder-gray-600"
    />
  </div>

  {/* Filtre catégorie */}
  <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
    <Filter size={18} className="mr-2 text-gray-600"/>
    <span className="text-gray-600 text-sm">Toutes les catégories</span>
  </div>

  {/* Switch vue grille / liste */}
  <div className="flex items-center bg-white rounded-full px-3 py-1 shadow-sm">
    <button className="bg-green-600 text-white rounded-full p-2">
      <Grid size={18}/>
    </button>
    <button className="p-2 text-gray-500">
      <List size={18}/>
    </button>
  </div>
</div>


      {/* Tabs */}
      <div className="flex items-center gap-3 mt-4">
        <button className="bg-green-600 text-white px-4 py-1 rounded-full text-sm font-medium">
          Toutes les catégories
        </button>
        <button className="bg-white px-4 py-1 rounded-full shadow-sm text-sm text-gray-700">
          En cours <span className="font-bold">2</span>
        </button>
        <button className="bg-white px-4 py-1 rounded-full shadow-sm text-sm text-gray-700">
          À venir <span className="font-bold">3</span>
        </button>
        <button className="bg-white px-4 py-1 rounded-full shadow-sm text-sm text-gray-700">
          Terminés <span className="font-bold">5</span>
        </button>
      </div>
    </div>
  );
}
