import React, { useState, useEffect, useCallback } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiShield, FiUser, FiLogIn, FiUserPlus, FiAlertCircle, FiBriefcase } from "react-icons/fi";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../lib/axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";

const LoginPagePro = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // État pour le sélecteur de rôle optionnel
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedRole, setSelectedRole] = useState("auto"); // auto, collaborateur, admin

  // États de validation en temps réel
  const [validation, setValidation] = useState({
    email: { isValid: false, message: "" },
    password: { isValid: false, message: "" }
  });

  // Animation et états visuels
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Animation d'entrée
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Gestion du verrouillage temporaire
  useEffect(() => {
    if (isLocked && lockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setLockTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (lockTimeRemaining === 0) {
      setIsLocked(false);
      setLoginAttempts(0);
    }
  }, [isLocked, lockTimeRemaining]);

  // Validation en temps réel avec debounce
  const debouncedValidation = useCallback(
    debounce((field, value) => {
      validateField(field, value);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    debouncedValidation(name, value);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        const emailValid = validateEmail(value);
        setValidation(prev => ({
          ...prev,
          email: {
            isValid: emailValid,
            message: emailValid ? "" : value ? "Format d'email invalide" : ""
          }
        }));
        break;

      case 'password':
        const passwordValid = value.length >= 6;
        setValidation(prev => ({
          ...prev,
          password: {
            isValid: passwordValid,
            message: passwordValid ? "" : value ? "Mot de passe trop court" : ""
          }
        }));
        break;
    }
  };

  // Composant de validation visuelle
  const ValidationIcon = ({ isValid, hasValue }) => {
    if (!hasValue) return null;
    return isValid ? 
      <FiCheck className="text-green-500" size={16} /> : 
      <FiX className="text-red-500" size={16} />;
  };

  // Fonction pour détecter le rôle automatiquement
  const detectUserRole = (email) => {
    // Emails administrateurs spécifiques
    const adminEmails = [
      'admin@satoripop.com',
      'directeur@satoripop.com',
      'manager@satoripop.com',
      'direction@satoripop.com',
      'chef@satoripop.com'
    ];

    // Domaines administrateurs
    const adminDomains = ['admin.satoripop.com', 'direction.satoripop.com'];

    // Mots-clés dans l'email qui indiquent un rôle admin
    const adminKeywords = ['admin', 'directeur', 'manager', 'chef', 'direction'];

    const emailLower = email.toLowerCase();
    const domain = email.split('@')[1];

    // Vérification par email exact
    if (adminEmails.includes(emailLower)) {
      return 'admin';
    }

    // Vérification par domaine
    if (adminDomains.includes(domain)) {
      return 'admin';
    }

    // Vérification par mots-clés dans l'email
    if (adminKeywords.some(keyword => emailLower.includes(keyword))) {
      return 'admin';
    }

    // Par défaut, tous les autres emails sont des collaborateurs
    return 'collaborateur';
  };

  // Fonction pour obtenir le message de bienvenue selon le rôle
  const getWelcomeMessage = (userRole, userName) => {
    switch (userRole) {
      case 'admin':
        return `Bienvenue ${userName} ! Redirection vers le tableau de bord administrateur...`;
      case 'manager':
        return `Bienvenue ${userName} ! Accès manager activé.`;
      default:
        return `Bienvenue ${userName} ! Bon retour sur Satoripop.`;
    }
  };

  // Fonction pour obtenir la redirection selon le rôle
  const getRedirectPath = (userRole, from) => {
    switch (userRole) {
      case 'admin':
        return from || '/admin-dashboard'; // Redirection vers le nouveau tableau de bord admin
      case 'manager':
        return from || '/manager-dashboard';
      default:
        return from || '/accueil';
    }
  };

  // Gestion de la soumission avec détection automatique du rôle
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLocked) {
    toast.error(`Compte temporairement verrouillé. Réessayez dans ${lockTimeRemaining}s`);
    return;
  }
  if (!validation.email.isValid || !validation.password.isValid) {
    toast.error("Veuillez corriger les erreurs avant de continuer.");
    return;
  }

  try {
    setLoading(true);

    // (Optionnel, seulement pour l'UX)
    const roleToUse = selectedRole === "auto"
      ? detectUserRole(formData.email)
      : selectedRole;

    // ⛔ NE PAS mettre l’URL complète ici, on a déjà baseURL
    // ⛔ Ne pas lire .data (interceptor renvoie déjà le JSON)
    const { user, token } = await api.post("/auth/login", {
      email: formData.email.trim(),
      password: formData.password.trim(),
      // expectedRole: roleToUse, // <- envoie-le seulement si ton backend l’accepte
    });

    if (user.role !== roleToUse && selectedRole !== "auto") {
      toast.warning(`Rôle choisi: ${roleToUse}, mais votre compte est: ${user.role}`);
    }

    // stockage du token + user
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));
    if (rememberMe) storage.setItem("rememberMe", "true");

    setLoginAttempts(0);

    const welcomeMessage = getWelcomeMessage(user.role, user.firstName || user.username);
    toast.success(welcomeMessage);

    const from = location.state?.from?.pathname;
    const redirectPath = getRedirectPath(user.role, from);
    setTimeout(() => navigate(redirectPath, { replace: true }), 1200);

  } catch (err) {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 3) {
      setIsLocked(true);
      setLockTimeRemaining(30);
      toast.error("Trop de tentatives échouées. Compte verrouillé pendant 30 secondes.");
    } else {
      const msg = err?.response?.data?.msg || err?.message || "Erreur lors de la connexion";
      toast.error(msg);
      toast.warning(`Tentative ${newAttempts}/3. Attention au verrouillage !`);
    }
  } finally {
    setLoading(false);
  }
};



  const canSubmit = validation.email.isValid && validation.password.isValid && formData.email && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 px-4">
      <ToastContainer />

      {/* Container principal - même style que RegisterPage */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header simple - même style que RegisterPage */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <FiShield className="text-white" size={24} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Connexion</h2>
          <p className="text-gray-600">Accédez à Satoripop Challenges</p>
        </div>

        {/* Formulaire */}
        <div>
          {/* Alerte de verrouillage - style RegisterPage */}
          {isLocked && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FiAlertCircle className="text-red-500" size={20} />
              <div>
                <p className="text-red-800 font-semibold text-sm">Compte temporairement verrouillé</p>
                <p className="text-red-600 text-xs">Réessayez dans {lockTimeRemaining} secondes</p>
              </div>
            </div>
          )}

          {/* Indicateur de tentatives - style RegisterPage */}
          {loginAttempts > 0 && !isLocked && (
            <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 text-sm">
                ⚠️ Tentative {loginAttempts}/3 - Attention au verrouillage
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email avec validation - style RegisterPage */}
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
                  disabled={isLocked}
                />
                <div className="ml-2">
                  <ValidationIcon
                    isValid={validation.email.isValid}
                    hasValue={!!formData.email}
                  />
                </div>
              </div>
              {validation.email.message && (
                <p className={`text-xs mt-1 ${validation.email.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe avec validation - style RegisterPage */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Mot de passe *
              </label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                formData.password ?
                  (validation.password.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                  : 'border-gray-300 focus-within:border-blue-500'
              }`}>
                <FiLock className="text-gray-400 mr-3" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none bg-transparent"
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                  disabled={isLocked}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                <div className="ml-2">
                  <ValidationIcon
                    isValid={validation.password.isValid}
                    hasValue={!!formData.password}
                  />
                </div>
              </div>
              {validation.password.message && (
                <p className={`text-xs mt-1 ${validation.password.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {validation.password.message}
                </p>
              )}
            </div>

            {/* Sélecteur de rôle optionnel */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">
                  Type de connexion
                </label>
                <button
                  type="button"
                  onClick={() => setShowRoleSelector(!showRoleSelector)}
                  className="text-xs text-blue-500 hover:text-blue-600 underline"
                >
                  {showRoleSelector ? 'Masquer' : 'Personnaliser'}
                </button>
              </div>

              {showRoleSelector ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="roleSelector"
                      value="auto"
                      checked={selectedRole === "auto"}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">🤖 Détection automatique (recommandé)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="roleSelector"
                      value="collaborateur"
                      checked={selectedRole === "collaborateur"}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">👤 Collaborateur</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="roleSelector"
                      value="admin"
                      checked={selectedRole === "admin"}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm text-gray-700">🛡️ Administrateur</span>
                  </label>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  🤖 Détection automatique basée sur votre email
                </div>
              )}
            </div>

            {/* Options - style RegisterPage */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={isLocked}
                />
                <span className="text-gray-600">
                  Se souvenir de moi
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton de connexion - style RegisterPage */}
            <button
              type="submit"
              disabled={loading || !canSubmit || isLocked}
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connexion...
                </div>
              ) : isLocked ? (
                `Compte verrouillé (${lockTimeRemaining}s)`
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Lien mot de passe oublié */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Footer - style RegisterPage */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Pas de compte ?{" "}
            <Link to="/register" className="text-blue-500 hover:underline font-semibold">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPagePro;
