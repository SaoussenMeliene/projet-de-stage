import React, { useState, useEffect, useCallback } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiAlertCircle, FiShield, FiBriefcase, FiMapPin } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";

const RegisterPagePro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    company: "",
    role: "collaborateur"
  });

  // États de validation en temps réel
  const [validation, setValidation] = useState({
    username: { isValid: false, message: "", checking: false },
    email: { isValid: false, message: "", checking: false },
    password: { isValid: false, message: "", strength: 0, checks: {} },
    confirmPassword: { isValid: false, message: "" }
  });

  const navigate = useNavigate();

  // Validation en temps réel avec debounce
  const debouncedValidation = useCallback(
    debounce(async (field, value) => {
      if (field === 'username' && value.length >= 3) {
        setValidation(prev => ({ ...prev, username: { ...prev.username, checking: true } }));
        try {
          // Simulation d'API - remplacer par votre vraie API
          await new Promise(resolve => setTimeout(resolve, 500));
          const isAvailable = !['admin', 'test', 'user'].includes(value.toLowerCase());
          setValidation(prev => ({
            ...prev,
            username: {
              isValid: isAvailable,
              message: isAvailable ? "Nom d'utilisateur disponible" : "Nom d'utilisateur déjà pris",
              checking: false
            }
          }));
        } catch (error) {
          setValidation(prev => ({
            ...prev,
            username: { isValid: false, message: "Erreur de vérification", checking: false }
          }));
        }
      }

      if (field === 'email' && validateEmail(value)) {
        setValidation(prev => ({ ...prev, email: { ...prev.email, checking: true } }));
        try {
          // Simulation d'API - remplacer par votre vraie API
          await new Promise(resolve => setTimeout(resolve, 500));
          const isAvailable = !value.includes('test@');
          setValidation(prev => ({
            ...prev,
            email: {
              isValid: isAvailable,
              message: isAvailable ? "Email disponible" : "Email déjà utilisé",
              checking: false
            }
          }));
        } catch (error) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: "Erreur de vérification", checking: false }
          }));
        }
      }
    }, 500),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validation en temps réel
    validateField(name, value);
    
    // Vérification de disponibilité pour username et email
    if (name === 'username' || name === 'email') {
      debouncedValidation(name, value);
    }
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const strength = Object.values(checks).filter(Boolean).length;
    return { checks, strength };
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'username':
        const usernameValid = value.length >= 3 && /^[a-zA-Z0-9_]+$/.test(value);
        setValidation(prev => ({
          ...prev,
          username: {
            ...prev.username,
            isValid: usernameValid,
            message: usernameValid ? "" : "3+ caractères, lettres, chiffres et _ uniquement"
          }
        }));
        break;

      case 'email':
        const emailValid = validateEmail(value);
        setValidation(prev => ({
          ...prev,
          email: {
            ...prev.email,
            isValid: emailValid,
            message: emailValid ? "" : "Format d'email invalide"
          }
        }));
        break;

      case 'password':
        const passwordValidation = validatePassword(value);
        setValidation(prev => ({
          ...prev,
          password: {
            isValid: passwordValidation.strength >= 4,
            message: "",
            strength: passwordValidation.strength,
            checks: passwordValidation.checks
          }
        }));
        break;

      case 'confirmPassword':
        const confirmValid = value === formData.password && value.length > 0;
        setValidation(prev => ({
          ...prev,
          confirmPassword: {
            isValid: confirmValid,
            message: confirmValid ? "" : "Les mots de passe ne correspondent pas"
          }
        }));
        break;
    }
  };

  // Composant de validation visuelle
  const ValidationIcon = ({ isValid, isChecking }) => {
    if (isChecking) return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
    if (isValid) return <FiCheck className="text-green-500" size={16} />;
    return <FiX className="text-red-500" size={16} />;
  };

  // Indicateur de force du mot de passe
  const PasswordStrengthIndicator = ({ strength, checks }) => {
    const getStrengthColor = () => {
      if (strength <= 2) return "bg-red-500";
      if (strength <= 3) return "bg-yellow-500";
      return "bg-green-500";
    };

    const getStrengthText = () => {
      if (strength <= 2) return "Faible";
      if (strength <= 3) return "Moyen";
      return "Fort";
    };

    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            ></div>
          </div>
          <span className={`text-xs font-medium ${strength >= 4 ? 'text-green-600' : strength >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
            {getStrengthText()}
          </span>
        </div>
        
        {checks && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className={`flex items-center gap-1 ${checks.length ? 'text-green-600' : 'text-gray-400'}`}>
              {checks.length ? <FiCheck size={12} /> : <FiX size={12} />}
              8+ caractères
            </div>
            <div className={`flex items-center gap-1 ${checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
              {checks.uppercase ? <FiCheck size={12} /> : <FiX size={12} />}
              Majuscule
            </div>
            <div className={`flex items-center gap-1 ${checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
              {checks.lowercase ? <FiCheck size={12} /> : <FiX size={12} />}
              Minuscule
            </div>
            <div className={`flex items-center gap-1 ${checks.number ? 'text-green-600' : 'text-gray-400'}`}>
              {checks.number ? <FiCheck size={12} /> : <FiX size={12} />}
              Chiffre
            </div>
            <div className={`flex items-center gap-1 ${checks.special ? 'text-green-600' : 'text-gray-400'}`}>
              {checks.special ? <FiCheck size={12} /> : <FiX size={12} />}
              Caractère spécial
            </div>
          </div>
        )}
      </div>
    );
  };

  const canProceedToStep2 = () => {
    return validation.username.isValid && 
           validation.email.isValid && 
           validation.password.isValid && 
           validation.confirmPassword.isValid &&
           formData.username && formData.email && formData.password && formData.confirmPassword;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      if (canProceedToStep2()) {
        setStep(2);
      } else {
        toast.error("Veuillez corriger les erreurs avant de continuer.");
      }
      return;
    }

    if (!acceptTerms) {
      toast.error("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        company: formData.company,
        role: formData.role
      });

      toast.success("Inscription réussie ! Bienvenue chez Satoripop !");
      setTimeout(() => navigate("/accueil"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Erreur d'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 px-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header avec progression */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FiShield className="text-white" size={24} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Créer un compte</h2>
          <p className="text-gray-600">Rejoignez Satoripop Challenges</p>
          
          {/* Indicateur de progression */}
          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm text-gray-600">Compte</span>
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm text-gray-600">Profil</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              {/* Username avec validation */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Nom d'utilisateur *
                </label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.username ? 
                    (validation.username.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') 
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiUser className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="username"
                    placeholder="votre_nom_utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <div className="ml-2">
                    <ValidationIcon 
                      isValid={validation.username.isValid} 
                      isChecking={validation.username.checking} 
                    />
                  </div>
                </div>
                {validation.username.message && (
                  <p className={`text-xs mt-1 ${validation.username.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.username.message}
                  </p>
                )}
              </div>

              {/* Email avec validation */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Adresse email *
                </label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.email ? 
                    (validation.email.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') 
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiMail className="text-gray-400 mr-3" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="vous@satoripop.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <div className="ml-2">
                    <ValidationIcon 
                      isValid={validation.email.isValid} 
                      isChecking={validation.email.checking} 
                    />
                  </div>
                </div>
                {validation.email.message && (
                  <p className={`text-xs mt-1 ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.email.message}
                  </p>
                )}
              </div>

              {/* Mot de passe avec indicateur de force */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Mot de passe *
                </label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.password ? 
                    (validation.password.isValid ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50') 
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiLock className="text-gray-400 mr-3" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mot de passe sécurisé"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <PasswordStrengthIndicator 
                    strength={validation.password.strength} 
                    checks={validation.password.checks} 
                  />
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.confirmPassword ? 
                    (validation.confirmPassword.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50') 
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiLock className="text-gray-400 mr-3" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  <div className="ml-2">
                    <ValidationIcon 
                      isValid={validation.confirmPassword.isValid} 
                      isChecking={false} 
                    />
                  </div>
                </div>
                {validation.confirmPassword.message && (
                  <p className="text-xs mt-1 text-red-600">
                    {validation.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Informations de profil</h3>
                <p className="text-gray-600 text-sm">Complétez votre profil (optionnel)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Prénom</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
                    <FiUser className="text-gray-400 mr-3" size={18} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Prénom"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Nom</label>
                  <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
                    <FiUser className="text-gray-400 mr-3" size={18} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Entreprise</label>
                <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
                  <FiBriefcase className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="company"
                    placeholder="Nom de votre entreprise"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Rôle</label>
                <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500">
                  <FiMapPin className="text-gray-400 mr-3" size={18} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  >
                    <option value="collaborateur">Collaborateur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    J'accepte les{" "}
                    <Link to="/terms" className="text-blue-500 hover:underline">
                      conditions d'utilisation
                    </Link>{" "}
                    et la{" "}
                    <Link to="/privacy" className="text-blue-500 hover:underline">
                      politique de confidentialité
                    </Link>
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 mt-8">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition duration-200"
              >
                Retour
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || (step === 1 && !canProceedToStep2()) || (step === 2 && !acceptTerms)}
              className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Inscription...
                </div>
              ) : step === 1 ? (
                "Continuer"
              ) : (
                "Créer mon compte"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-blue-500 hover:underline font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPagePro;
