import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Veuillez saisir votre adresse email.');
      return;
    }

    try {
      setLoading(true);
      
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email
      });

      console.log('Réponse:', response.data);
      
      setEmailSent(true);
      setResetToken(response.data.resetToken); // Pour le développement
      toast.success('Instructions de réinitialisation envoyées !');

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.msg || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">
        <ToastContainer />
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMail className="text-green-600" size={24} />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email envoyé !
            </h1>
            
            <p className="text-gray-600 mb-6">
              Si votre adresse email existe dans notre système, vous recevrez un lien de réinitialisation.
            </p>

            {/* Pour le développement - afficher le token */}
            {resetToken && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Mode développement :</strong>
                </p>
                <p className="text-xs text-yellow-700 mb-2">
                  Token: <code className="bg-yellow-100 px-1 rounded">{resetToken}</code>
                </p>
                <Link 
                  to={`/reset-password?token=${resetToken}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  → Cliquez ici pour réinitialiser votre mot de passe
                </Link>
              </div>
            )}

            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
              >
                <FiArrowLeft size={18} />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="text-blue-600" size={24} />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Mot de passe oublié ?
          </h1>
          
          <p className="text-gray-600">
            Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Adresse email
            </label>
            <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
              <FiMail className="text-gray-400 mr-3" size={18} />
              <input
                type="email"
                placeholder="vous@satoripop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Envoi en cours...
              </div>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-semibold flex items-center justify-center gap-2"
          >
            <FiArrowLeft size={16} />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
