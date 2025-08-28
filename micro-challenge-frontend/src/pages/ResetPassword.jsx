import React, { useState, useEffect } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    length: false,
    match: false
  });

  useEffect(() => {
    if (!token) {
      toast.error('Token de réinitialisation manquant');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Validation en temps réel
    setValidation({
      length: formData.newPassword.length >= 6,
      match: formData.newPassword === formData.confirmPassword && formData.confirmPassword.length > 0
    });
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validation.length) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (!validation.match) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);

      await axios.post('http://localhost:5000/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });

      toast.success('Mot de passe réinitialisé avec succès !');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.msg || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = validation.length && validation.match;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">

      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
  <FiLock className="text-blue-600" size={24} />
</div>

          
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Nouveau mot de passe
          </h1>
          
          <p className="text-gray-600">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nouveau mot de passe */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Nouveau mot de passe
            </label>
            <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
              formData.newPassword ? 
                (validation.length ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                : 'border-gray-300 focus-within:border-blue-500'
            }`}>
              <FiLock className="text-gray-400 mr-3" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
              {formData.newPassword && (
                <div className="ml-2">
                  {validation.length ? 
                    <FiCheck className="text-green-500" size={16} /> : 
                    <span className="text-red-500 text-xs">✕</span>
                  }
                </div>
              )}
            </div>
            {formData.newPassword && (
              <p className={`text-xs mt-1 ${validation.length ? 'text-green-600' : 'text-red-600'}`}>
                {validation.length ? 'Longueur suffisante' : 'Au moins 6 caractères requis'}
              </p>
            )}
          </div>

          {/* Confirmation du mot de passe */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Confirmer le mot de passe
            </label>
            <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
              formData.confirmPassword ? 
                (validation.match ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                : 'border-gray-300 focus-within:border-blue-500'
            }`}>
              <FiLock className="text-gray-400 mr-3" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent"
                disabled={loading}
              />
              {formData.confirmPassword && (
                <div className="ml-2">
                  {validation.match ? 
                    <FiCheck className="text-green-500" size={16} /> : 
                    <span className="text-red-500 text-xs">✕</span>
                  }
                </div>
              )}
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${validation.match ? 'text-green-600' : 'text-red-600'}`}>
                {validation.match ? 'Les mots de passe correspondent' : 'Les mots de passe ne correspondent pas'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !canSubmit}
           className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Réinitialisation...
              </div>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-semibold"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
