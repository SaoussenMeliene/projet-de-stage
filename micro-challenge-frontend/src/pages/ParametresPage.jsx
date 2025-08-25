import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDashboard from '../components/HeaderDashboard';
import { useTheme } from '../contexts/ThemeContext';
import {
  Settings, Palette, Moon, Sun, Bell, Shield, User,
  ChevronRight, Check, Monitor
} from 'lucide-react';

const ParametresPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const themeOptions = [
    { value: 'light', label: 'Mode clair', icon: Sun },
    { value: 'dark', label: 'Mode sombre', icon: Moon },
    { value: 'auto', label: 'Automatique', icon: Monitor }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <HeaderDashboard />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* En-tête */}
          <div className={`mb-8 p-6 rounded-2xl shadow-sm ${
            isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Settings size={32} className="text-blue-500" />
              <h1 className="text-3xl font-bold">Paramètres</h1>
            </div>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Personnalisez votre expérience sur la plateforme
            </p>
          </div>

          {/* Section Apparence */}
          <div className={`mb-6 rounded-2xl shadow-sm overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Palette size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Apparence
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Personnalisez l'interface selon vos préférences
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Mode d'affichage
                </h3>
                <div className="space-y-2">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = theme === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          if (option.value === 'auto') {
                            // Pour l'auto, on détecte la préférence système
                            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                            // On pourrait implémenter un vrai mode auto plus tard
                            toggleTheme();
                          } else if (option.value !== theme) {
                            toggleTheme();
                          }
                        }}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : isDark
                              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="flex-1 text-left font-medium">
                          {option.label}
                        </span>
                        {isSelected && <Check size={20} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prévisualisation */}
              <div className="mt-6 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <p className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Prévisualisation du thème {isDark ? 'sombre' : 'clair'} 
                  <span className="block mt-1">
                    Les changements sont appliqués instantanément !
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Section Notifications */}
          <div className={`mb-6 rounded-2xl shadow-sm overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Bell size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Notifications
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Gérez vos préférences de notifications
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Notifications push
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Recevoir des notifications pour les nouveaux défis et messages
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-blue-500' : isDark ? 'bg-gray-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParametresPage;