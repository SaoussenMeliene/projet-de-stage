import React, { useState, useEffect, useCallback } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiCamera, FiUpload, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import UserAvatar from "../components/UserAvatar";
import { useTheme } from "../contexts/ThemeContext";

const RegisterPageNew = () => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "collaborateur"
  });

  // État pour l'image de profil
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  // États de validation
  const [validation, setValidation] = useState({
    username: { isValid: false, message: "", checking: false },
    email: { isValid: false, message: "", checking: false },
    password: { isValid: false, message: "", strength: 0 },
    confirmPassword: { isValid: false, message: "" }
  });

  // Mode de validation (strict ou permissif si serveur indisponible)
  const [validationMode, setValidationMode] = useState('strict');

  // Validation en temps réel avec debounce
  const debouncedValidation = useCallback(
    debounce((field, value) => {
      validateField(field, value);
    }, 300),
    []
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Auto-complétion pour l'email
    if (name === 'email') {
      finalValue = handleEmailAutoComplete(value);
    }

    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);

    // Pour la validation, on passe les nouvelles valeurs
    if (name === 'password' || name === 'confirmPassword') {
      validatePasswordFields(name, finalValue, newFormData);
    } else {
      debouncedValidation(name, finalValue);
    }
  };

  // Fonction d'auto-complétion pour l'email
  const handleEmailAutoComplete = (value) => {
    // Si l'utilisateur tape @ et qu'il n'y a pas encore de domaine complet
    if (value.endsWith('@') && !value.includes('@satoripop.com')) {
      return value + 'satoripop.com';
    }

    // Si l'utilisateur tape @s, @sa, @sat, etc., on complète automatiquement
    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const domain = value.substring(atIndex + 1);
      const targetDomain = 'satoripop.com';

      // Si le domaine tapé est un début de "satoripop.com" et pas complet
      if (targetDomain.startsWith(domain.toLowerCase()) && domain.length > 0 && domain.length < targetDomain.length) {
        return value.substring(0, atIndex + 1) + targetDomain;
      }
    }

    return value;
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getEmailValidationMessage = (email, isValid, isAvailable) => {
    if (!isValid) return "Format d'email invalide";
    if (!isAvailable) return "Email déjà utilisé";

    if (email.endsWith('@satoripop.com')) {
      return "✨ Email Satoripop - Parfait !";
    } else {
      return "Email disponible (recommandé: @satoripop.com)";
    }
  };

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

  // Fonction spécifique pour valider les mots de passe
  const validatePasswordFields = (field, value, currentFormData) => {
    console.log("🔍 Validation des mots de passe:", { field, value, currentFormData });

    if (field === 'password') {
      // Valider le mot de passe principal
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

      // Revalider la confirmation si elle existe
      if (currentFormData.confirmPassword) {
        const confirmValid = currentFormData.confirmPassword === value && currentFormData.confirmPassword.length > 0;
        console.log("🔄 Revalidation confirmPassword:", { confirmPassword: currentFormData.confirmPassword, password: value, confirmValid });
        setValidation(prev => ({
          ...prev,
          confirmPassword: {
            isValid: confirmValid,
            message: confirmValid ? "" : "Les mots de passe ne correspondent pas"
          }
        }));
      }
    }

    if (field === 'confirmPassword') {
      const confirmValid = value === currentFormData.password && value.length > 0;
      console.log("🔍 Validation confirmPassword:", { confirmPassword: value, password: currentFormData.password, confirmValid });
      setValidation(prev => ({
        ...prev,
        confirmPassword: {
          isValid: confirmValid,
          message: confirmValid ? "" : "Les mots de passe ne correspondent pas"
        }
      }));
    }
  };

  const validateField = async (field, value) => {
    switch (field) {
      case 'username':
        setValidation(prev => ({ ...prev, username: { ...prev.username, checking: true } }));

        if (value.length < 3) {
          setValidation(prev => ({
            ...prev,
            username: { isValid: false, message: "Au moins 3 caractères", checking: false }
          }));
          return;
        }

        try {
          const response = await axios.get(`http://localhost:5000/api/auth/check-username/${encodeURIComponent(value)}`);
          console.log("✅ Username check success:", response.data);
          setValidation(prev => ({
            ...prev,
            username: { isValid: true, message: "Nom d'utilisateur disponible", checking: false }
          }));
        } catch (error) {
          console.log("❌ Username check error:", error.response?.status, error.response?.data);
          let errorMessage = "Erreur de vérification";

          if (error.response?.status === 409) {
            errorMessage = "Nom d'utilisateur déjà pris";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.msg || "Format invalide";
          } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            errorMessage = "Impossible de vérifier (serveur indisponible)";
            // En mode permissif, on considère comme valide si le serveur est indisponible
            setValidation(prev => ({
              ...prev,
              username: { isValid: true, message: "⚠️ Validation impossible - sera vérifiée à l'inscription", checking: false }
            }));
            setValidationMode('permissive');
            return;
          }

          setValidation(prev => ({
            ...prev,
            username: { isValid: false, message: errorMessage, checking: false }
          }));
        }
        break;

      case 'email':
        setValidation(prev => ({ ...prev, email: { ...prev.email, checking: true } }));

        if (!validateEmail(value)) {
          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: "Format d'email invalide", checking: false }
          }));
          return;
        }

        try {
          const response = await axios.get(`http://localhost:5000/api/auth/check-email/${encodeURIComponent(value)}`);
          console.log("✅ Email check success:", response.data);
          const message = getEmailValidationMessage(value, true, true);
          setValidation(prev => ({
            ...prev,
            email: { isValid: true, message: message, checking: false }
          }));
        } catch (error) {
          console.log("❌ Email check error:", error.response?.status, error.response?.data);
          let errorMessage = "Erreur de vérification";

          if (error.response?.status === 409) {
            errorMessage = "Email déjà utilisé";
          } else if (error.response?.status === 400) {
            errorMessage = error.response.data.msg || "Format invalide";
          } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            errorMessage = "Impossible de vérifier (serveur indisponible)";
            // En mode permissif, on considère comme valide si le serveur est indisponible
            setValidation(prev => ({
              ...prev,
              email: { isValid: true, message: "⚠️ Validation impossible - sera vérifiée à l'inscription", checking: false }
            }));
            setValidationMode('permissive');
            return;
          }

          setValidation(prev => ({
            ...prev,
            email: { isValid: false, message: errorMessage, checking: false }
          }));
        }
        break;


    }
  };

  // Gestion de l'image de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Seules les images (JPEG, PNG, GIF, WebP) sont autorisées');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
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

      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('role', formData.role);
      
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      await axios.post("http://localhost:5000/api/auth/register", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Inscription réussie ! Redirection vers la connexion...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  // Composants utilitaires
  const ValidationIcon = ({ isValid, isChecking }) => {
    if (isChecking) return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>;
    if (isValid) return <FiCheck className="text-green-500" size={16} />;
    return <FiX className="text-red-500" size={16} />;
  };

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
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
              style={{ width: `${(strength / 5) * 100}%` }}
            ></div>
          </div>
          <span className={`text-xs font-medium ${getStrengthColor().replace('bg-', 'text-')}`}>
            {getStrengthText()}
          </span>
        </div>
        
        {checks && (
          <div className="grid grid-cols-2 gap-1 text-xs">
            <span className={checks.length ? 'text-green-600' : 'text-gray-400'}>
              ✓ 8+ caractères
            </span>
            <span className={checks.uppercase ? 'text-green-600' : 'text-gray-400'}>
              ✓ Majuscule
            </span>
            <span className={checks.lowercase ? 'text-green-600' : 'text-gray-400'}>
              ✓ Minuscule
            </span>
            <span className={checks.number ? 'text-green-600' : 'text-gray-400'}>
              ✓ Chiffre
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
      isDark 
        ? 'dark bg-gradient-to-br from-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <ToastContainer />
      <div className={`p-8 rounded-3xl shadow-2xl max-w-md w-full transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-100'
      }`}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUser className="text-white" size={24} />
          </div>
          <h1 className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Créer un compte</h1>
          <p className={`transition-colors duration-300 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>Rejoignez notre communauté de défis</p>
        </div>

        {/* Indicateur de progression */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 1 ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500')
            }`}>
              1
            </div>
            <span className={`ml-2 text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Compte</span>
          </div>
          <div className={`w-12 h-1 transition-all duration-300 ${
            step >= 2 ? 'bg-blue-500' : (isDark ? 'bg-gray-600' : 'bg-gray-200')
          }`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              step >= 2 ? 'bg-blue-500 text-white' : (isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-500')
            }`}>
              2
            </div>
            <span className={`ml-2 text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Profil</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              {/* Username */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Nom d'utilisateur *</label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.username ? 
                    (validation.username.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiUser className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Votre nom d'utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <ValidationIcon isValid={validation.username.isValid} isChecking={validation.username.checking} />
                </div>
                {validation.username.message && (
                  <p className={`text-xs mt-1 ${validation.username.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {validation.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Adresse email *</label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.email ?
                    (validation.email.isValid ?
                      (formData.email.endsWith('@satoripop.com') ? 'border-emerald-300 bg-emerald-50' : 'border-green-300 bg-green-50')
                      : 'border-red-300 bg-red-50')
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiMail className="text-gray-400 mr-3" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="votrenom@satoripop.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <ValidationIcon isValid={validation.email.isValid} isChecking={validation.email.checking} />
                </div>

                {/* Message de validation */}
                {validation.email.message && (
                  <p className={`text-xs mt-1 ${
                    validation.email.isValid ?
                      (formData.email.endsWith('@satoripop.com') ? 'text-emerald-600' : 'text-green-600')
                      : 'text-red-600'
                  }`}>
                    {validation.email.message}
                  </p>
                )}

                {/* Info sur l'auto-complétion */}
                {formData.email && !formData.email.includes('@') && formData.email.length > 2 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-700">
                      💡 <strong>Astuce :</strong> Tapez simplement <code>@</code> pour auto-compléter avec @satoripop.com
                    </p>
                  </div>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Mot de passe *</label>
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
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

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Confirmer le mot de passe *</label>
                <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-colors ${
                  formData.confirmPassword ? 
                    (validation.confirmPassword.isValid ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')
                    : 'border-gray-300 focus-within:border-blue-500'
                }`}>
                  <FiLock className="text-gray-400 mr-3" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full outline-none bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                  {formData.confirmPassword && (
                    <ValidationIcon isValid={validation.confirmPassword.isValid} />
                  )}
                </div>
                {validation.confirmPassword.message && (
                  <p className="text-xs mt-1 text-red-600">
                    {validation.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Image de profil */}
              <div className="text-center">
                <label className="block mb-4 text-sm font-semibold text-gray-700">Photo de profil (optionnel)</label>
                
                <div className="flex flex-col items-center space-y-4">
                  {/* Aperçu de l'image ou avatar par défaut */}
                  <div className="relative">
                    {profileImagePreview ? (
                      <div className="relative">
                        <img 
                          src={profileImagePreview} 
                          alt="Aperçu" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <UserAvatar 
                        name={formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : formData.username}
                        email={formData.email}
                        size="xl"
                        showBorder={true}
                        className="border-4 border-white shadow-lg"
                      />
                    )}
                  </div>

                  {/* Bouton d'upload */}
                  <div>
                    <input
                      type="file"
                      id="profileImageInput"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="profileImageInput"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      <FiCamera size={16} />
                      {profileImage ? 'Changer la photo' : 'Ajouter une photo'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      JPEG, PNG, GIF, WebP - Max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Prénom */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Prénom</label>
                <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
                  <FiUser className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Nom */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Nom</label>
                <div className="flex items-center border-2 border-gray-300 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-colors">
                  <FiUser className="text-gray-400 mr-3" size={18} />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                  J'accepte les{" "}
                  <Link to="/terms" className="text-blue-500 hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="/privacy" className="text-blue-500 hover:underline">
                    politique de confidentialité
                  </Link>
                </label>
              </div>

              {/* Bouton retour */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              >
                ← Retour
              </button>
            </>
          )}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading || (step === 1 && !canProceedToStep2()) || (step === 2 && !acceptTerms)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Inscription...
              </div>
            ) : step === 1 ? (
              'Continuer →'
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* Footer */}
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

export default RegisterPageNew;
