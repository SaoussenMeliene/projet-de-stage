import Logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#0B0F1A] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-end gap-12">
        
        {/* Bloc Logo + Description */}
        <div className="md:w-1/3">
          <div className="flex items-center space-x-2 mb-4">
            <img
              src={Logo}
              alt="Satoripop Challenges"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl text-gray-400">Challenges</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            La plateforme collaborative qui transforme le travail en aventure.
            Relevez des défis, renforcez l'équipe et développez vos compétences
            dans un environnement bienveillant.
          </p>
        </div>

        {/* Bloc Fonctionnalités */}
        <div className="md:w-1/4">
          <h3 className="font-bold text-white mb-4">Fonctionnalités</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Micro-challenges</li>
            <li>Discussions de groupe</li>
            <li>Système de points</li>
            <li>Badges et récompenses</li>
          </ul>
        </div>

        {/* Bloc Support */}
        <div className="md:w-1/4">
          <h3 className="font-bold text-white mb-4">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Centre d'aide</li>
            <li>Documentation</li>
            <li>Contact support</li>
            <li>Feedback</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-4 text-center text-gray-500 text-sm">
        © 2025 Satoripop. Tous droits réservés. Conçu avec ❤️ pour nos équipes.
      </div>
    </footer>
  );
}
