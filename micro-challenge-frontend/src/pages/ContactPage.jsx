import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ContactPage = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen px-8 py-16 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-r from-gray-900 to-gray-800' 
        : 'bg-gradient-to-r from-green-100 to-blue-100'
    }`}>
      <div className={`max-w-xl mx-auto transition-colors duration-300 ${
        isDark ? 'text-gray-200' : 'text-gray-800'
      }`}>
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="mb-4 text-lg">
          Une question, une suggestion ou une envie de collaborer ? Écrivez-nous !
        </p>
        <p className="text-lg mb-2">
          📧 <a href="mailto:support@satoripop.com" className="text-green-600 underline">support@satoripop.com</a>
        </p>
        <p className="text-lg">
          💼 Suivez-nous sur <a href="https://www.linkedin.com/company/satoripop" target="_blank" rel="noreferrer" className="text-green-600 underline">LinkedIn</a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
