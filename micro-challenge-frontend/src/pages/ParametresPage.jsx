import React, { useState, useEffect } from "react";
import HeaderDashboard from "../components/HeaderDashboard";
import {
  Settings,
  Bell,
  Eye,
  Palette,
  Shield,
  Download,
  Key,
  Trash2,
  ArrowLeft,
  Save,
  Globe
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ParametresPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    challengeReminders: true,
    publicProfile: true,
    showStats: true,
    showActivity: false,
    darkMode: false,
    language: 'fr'
  });

  useEffect(() => {
    // Charger les paramètres depuis localStorage ou API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting]
    };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleLanguageChange = (e) => {
    const newSettings = {
      ...settings,
      language: e.target.value
    };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Ici vous pourriez envoyer les paramètres à l'API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      alert('Paramètres sauvegardés avec succès !');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    alert('Fonctionnalité d\'export en cours de développement');
  };

  const handleChangePassword = () => {
    alert('Redirection vers la page de changement de mot de passe');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      alert('Fonctionnalité de suppression en cours de développement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderDashboard />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/profil')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            Retour au profil
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Paramètres</h1>
            <p className="text-gray-600">Gérez vos préférences et paramètres de compte</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Paramètres de notification */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Bell className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                <p className="text-gray-600">Gérez vos préférences de notification</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Notifications par email</h3>
                  <p className="text-sm text-gray-600">Recevoir des notifications pour les nouveaux défis</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('emailNotifications')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.emailNotifications ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Notifications push</h3>
                  <p className="text-sm text-gray-600">Recevoir des notifications sur votre appareil</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('pushNotifications')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.pushNotifications ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.pushNotifications ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Rappels de défis</h3>
                  <p className="text-sm text-gray-600">Recevoir des rappels pour les défis en cours</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('challengeReminders')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.challengeReminders ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.challengeReminders ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Paramètres de confidentialité */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Eye className="text-green-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Confidentialité</h2>
                <p className="text-gray-600">Contrôlez la visibilité de votre profil</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Profil public</h3>
                  <p className="text-sm text-gray-600">Permettre aux autres de voir votre profil</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('publicProfile')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.publicProfile ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.publicProfile ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Afficher les statistiques</h3>
                  <p className="text-sm text-gray-600">Permettre aux autres de voir vos statistiques</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('showStats')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.showStats ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.showStats ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Afficher l'activité</h3>
                  <p className="text-sm text-gray-600">Permettre aux autres de voir votre activité récente</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('showActivity')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.showActivity ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.showActivity ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Paramètres d'apparence */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Palette className="text-purple-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Apparence</h2>
                <p className="text-gray-600">Personnalisez l'interface</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-800">Mode sombre</h3>
                  <p className="text-sm text-gray-600">Utiliser le thème sombre</p>
                </div>
                <button 
                  onClick={() => handleSettingChange('darkMode')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.darkMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.darkMode ? 'right-0.5' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">Langue</h3>
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-gray-500" />
                  <select 
                    value={settings.language}
                    onChange={handleLanguageChange}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions du compte */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield className="text-red-600" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Sécurité et Compte</h2>
                <p className="text-gray-600">Gérez la sécurité de votre compte</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleExportData}
                className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="text-blue-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-800">Exporter mes données</h3>
                    <p className="text-sm text-blue-600">Télécharger toutes vos données personnelles</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleChangePassword}
                className="w-full p-4 text-left bg-yellow-50 hover:bg-yellow-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Key className="text-yellow-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-yellow-800">Changer le mot de passe</h3>
                    <p className="text-sm text-yellow-600">Modifier votre mot de passe de connexion</p>
                  </div>
                </div>
              </button>

              <button
                onClick={handleDeleteAccount}
                className="w-full p-4 text-left bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="text-red-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-red-800">Supprimer le compte</h3>
                    <p className="text-sm text-red-600">Supprimer définitivement votre compte</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Bouton de sauvegarde global */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Sauvegarder les modifications</h3>
                <p className="text-sm text-gray-600">Enregistrer tous vos paramètres</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;
