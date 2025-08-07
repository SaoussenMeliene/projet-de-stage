import React, { useState, useEffect, useCallback } from "react";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiAlertCircle, FiShield, FiCamera, FiUpload } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { debounce } from "lodash";
import UserAvatar from "../components/UserAvatar";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  // États de validation en temps réel
  const [validation, setValidation] = useState({
    username: { isValid: false, message: "", checking: false },
    email: { isValid: false, message: "", checking: false },
    password: { isValid: false, message: "", strength: 0 },
    confirmPassword: { isValid: false, message: "" }
  });

  const navigate = useNavigate();

  // Validation en temps réel avec debounce
  const debouncedValidation = useCallback(
    debounce(async (field, value) => {
      if (field === 'username' && value.length >= 3) {
        setValidation(prev => ({ ...prev, username: { ...prev.username, checking: true } }));
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/check-username/${value}`);
          setValidation(prev => ({
            ...prev,
            username: {
              isValid: response.data.available,
              message: response.data.available ? "Nom d'utilisateur disponible" : "Nom d'utilisateur déjà pris",
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
          const response = await axios.get(`http://localhost:5000/api/auth/check-email/${value}`);
          setValidation(prev => ({
            ...prev,
            email: {
              isValid: response.data.available,
              message: response.data.available ? "Email disponible" : "Email déjà utilisé",
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

  // Gestion de l'image de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Seules les images (JPEG, PNG, GIF, WebP) sont autorisées');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setProfileImage(file);

      // Créer un aperçu
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
    // Reset l'input file
    const fileInput = document.getElementById('profileImageInput');
    if (fileInput) fileInput.value = '';
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

      // Créer FormData pour envoyer l'image
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('role', formData.role);

      // Ajouter l'image si elle existe
      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      await axios.post("http://localhost:5000/api/auth/register", submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
          {/* Username */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Nom d’utilisateur</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FiUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="you@satoripop.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full py-2 outline-none"
              />
              <button type="button" onClick={togglePassword} className="text-gray-500">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full py-2 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

