import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={Logo}
            alt="Satoripop"
            className="h-8 w-auto object-contain"
          />
          <span className="text-xl font-bold text-gray-500 ml-2">Challenges</span>
        </Link>

        {/* MENU + BOUTON REGISTER ENSEMBLE */}
        <div className="flex items-center text-gray-600 font-medium space-x-8">
          <Link to="/about" className="hover:text-green-500">
            À propos
          </Link>
          <Link to="/features" className="hover:text-green-500">
            Fonctionnalités
          </Link>
          <Link to="/login" className="hover:text-green-500">
            Login
          </Link>

          {/* Bouton avec un grand espace à gauche */}
          <Link
            to="/register"
            className="ml-10 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
