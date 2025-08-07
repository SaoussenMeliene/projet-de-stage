import React, { useState } from 'react';

const TestValidation = () => {
  const [results, setResults] = useState([]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const testValidation = () => {
    const testCases = [
      'wassim@satoripop.com',
      'test@example.com',
      'invalid-email',
      'user@domain',
      'user@domain.com',
      'wassim123',
      ''
    ];

    const results = testCases.map(email => ({
      email,
      isValid: validateEmail(email),
      length: email.length
    }));

    setResults(results);
  };

  const testPassword = () => {
    const passwords = ['wassim123', '123', 'password', '', 'a'];
    
    const passwordResults = passwords.map(pwd => ({
      password: pwd || '(vide)',
      isValid: pwd.length >= 6,
      length: pwd.length
    }));

    setResults(passwordResults);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🔧 Test de Validation</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testValidation}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600"
          >
            📧 Tester Validation Email
          </button>
          
          <button
            onClick={testPassword}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600"
          >
            🔑 Tester Validation Mot de Passe
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Résultats :</h3>
          {results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={index} className={`p-2 rounded ${result.isValid ? 'bg-green-100' : 'bg-red-100'}`}>
                  <span className="font-mono">
                    {result.email || result.password} 
                  </span>
                  <span className={`ml-2 ${result.isValid ? 'text-green-700' : 'text-red-700'}`}>
                    {result.isValid ? '✅ Valide' : '❌ Invalide'}
                  </span>
                  <span className="text-gray-600 ml-2">
                    (longueur: {result.length})
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun test effectué</p>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">ℹ️ Règles de validation :</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Email : doit correspondre au pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/</li>
            <li>Mot de passe : doit faire au moins 6 caractères</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestValidation;
