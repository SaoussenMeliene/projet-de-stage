import React, { useState } from 'react';
import axios from 'axios';

const TestLogin = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('🔄 Test en cours...');

    try {
      console.log('🚀 Début du test de connexion');
      
      const loginData = {
        email: 'wassim@satoripop.com',
        password: 'wassim123'
      };

      console.log('📤 Envoi de la requête:', loginData);
      console.log('🎯 URL:', 'http://localhost:5000/api/auth/login');

      const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Réponse reçue:', response);
      
      setResult(`✅ SUCCÈS !
Status: ${response.status}
Token: ${response.data.token ? 'Reçu' : 'Non reçu'}
Utilisateur: ${response.data.user?.email}
Message: ${response.data.message}`);

    } catch (error) {
      console.error('❌ Erreur:', error);
      
      let errorMessage = '❌ ERREUR !\n';
      
      if (error.response) {
        errorMessage += `Status: ${error.response.status}\n`;
        errorMessage += `Message: ${error.response.data?.msg || 'Erreur inconnue'}\n`;
        errorMessage += `Data: ${JSON.stringify(error.response.data, null, 2)}`;
      } else if (error.request) {
        errorMessage += 'Aucune réponse du serveur\n';
        errorMessage += `Request: ${error.request}`;
      } else {
        errorMessage += `Erreur de configuration: ${error.message}`;
      }
      
      setResult(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testServerHealth = async () => {
    setLoading(true);
    setResult('🔄 Test de santé du serveur...');

    try {
      const response = await axios.get('http://localhost:5000/', { timeout: 5000 });
      setResult(`✅ Serveur accessible !
Réponse: ${response.data}`);
    } catch (error) {
      setResult(`❌ Serveur inaccessible !
Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🔧 Test de Connexion</h1>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={testServerHealth}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test en cours...' : '🏥 Tester la Santé du Serveur'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? '⏳ Test en cours...' : '🔐 Tester la Connexion'}
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">📋 Résultat :</h3>
          <pre className="whitespace-pre-wrap text-sm font-mono">
            {result || 'Aucun test effectué'}
          </pre>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-semibold mb-2">ℹ️ Informations :</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Email de test : wassim@satoripop.com</li>
            <li>Mot de passe : wassim123</li>
            <li>URL Backend : http://localhost:5000</li>
            <li>URL Frontend : http://localhost:5173</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestLogin;
