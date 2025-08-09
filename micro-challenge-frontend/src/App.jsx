import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPagePro from "./pages/LoginPagePro";
import RegisterPageNew from "./pages/RegisterPageNew";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

import '@fortawesome/fontawesome-free/css/all.min.css';
import Accueil from "./pages/Accueil";
import MesDefis from "./pages/MesDefis";
import VoirDefi from "./pages/VoirDefi";
import CalendrierModern from "./pages/CalendrierModern";
import MonGroupeSimple from "./pages/MonGroupeSimple";
import Recompenses from "./pages/Recompenses";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilPage from "./pages/ProfilPage";
import ParametresPage from "./pages/ParametresPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";



const App = () => {
  return (
   
      <Routes>
         {/* Définir la page d’accueil */}
        <Route path="/" element={<HomePage  />} />
         <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPagePro />} />
        <Route path="/register" element={<RegisterPageNew />} />
        <Route path="/dashboard" element={<Navigate to="/accueil" replace />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/mes-defis" element={<MesDefis />} />
        <Route path="/defi/:defiId" element={<VoirDefi />} />
        <Route path="/calendrier" element={<CalendrierModern />} />
        <Route path="/mon-groupe" element={<MonGroupeSimple />} />
        <Route path="/recompenses" element={<Recompenses />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/parametres" element={<ParametresPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
       </Routes>
    
  
  );
};

export default App;
