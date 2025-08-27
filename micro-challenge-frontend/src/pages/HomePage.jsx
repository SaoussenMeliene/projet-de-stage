import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import {
  ArrowRight,
  Play,
  Target,
  Users,
  Award,
  Leaf,
  Zap,
  Heart,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Shield,
  Sparkles,
  Calendar,
  MessageCircle,
  BarChart3
} from "lucide-react";
import Logo from "../components/Logo";
export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    setIsVisible(true);

    // Auto-rotation des témoignages
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Données des statistiques
  const stats = [
    { icon: Users, value: "2,500+", label: "Collaborateurs actifs", color: "from-blue-500 to-cyan-500" },
    { icon: Target, value: "150+", label: "Défis créés", color: "from-green-500 to-emerald-500" },
    { icon: Award, value: "50K+", label: "Points distribués", color: "from-yellow-500 to-orange-500" },
    { icon: Globe, value: "15", label: "Entreprises partenaires", color: "from-purple-500 to-pink-500" }
  ];

  // Fonctionnalités principales
  const features = [
    {
      icon: Target,
      title: "Défis Variés",
      description: "Bien-être, productivité, créativité, écologie... Des challenges pour tous les goûts",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: "Esprit d'Équipe",
      description: "Renforcez la cohésion avec des défis collaboratifs et motivants",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Points, badges, classements... Transformez l'engagement en jeu",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Mesurez l'engagement et l'impact de vos initiatives en temps réel",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  // Témoignages
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Responsable RH",
      company: "TechCorp",
      content: "Satoripop Challenges a révolutionné l'engagement de nos équipes. Les micro-défis créent une dynamique incroyable !",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Directeur Innovation",
      company: "CreativeLab",
      content: "Des défis créativité aux challenges bien-être, nos collaborateurs sont motivés et plus productifs !",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Manager",
      company: "InnovateCorp",
      content: "La variété des défis permet à chacun de trouver sa motivation. L'esprit d'équipe n'a jamais été aussi fort !",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'dark bg-gray-900' : 'bg-white'
    }`}>
      {/* Navigation moderne */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Logo size="medium" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-100">Challenges</span>
            </div>

            {/* Navigation links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors duration-200">
                Fonctionnalités
              </a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors duration-200">
                Témoignages
              </a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors duration-200">
                Contact
              </a>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors duration-200"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Section Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 relative overflow-hidden">
        {/* Effets de fond */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-purple-700 font-medium text-sm">Plateforme de micro-challenges</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Engagez
              </span>
              <br />
              <span className="text-gray-800">vos équipes avec</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                des micro-challenges
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Boostez l'engagement de vos collaborateurs avec des défis variés et ludiques :
              bien-être, productivité, créativité, écologie et plus encore !
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/register">
                <button className="group bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Commencer gratuitement</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>

              <Link to="/login">
                <button className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-gray-300 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <Play className="w-5 h-5" />
                  <span>Voir la démonstration</span>
                </button>
              </Link>
            </div>

            {/* Aperçu du dashboard */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-white/80 text-sm ml-4">satoripop-challenges.com</span>
                  </div>
                </div>
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">Défis Actifs</h3>
                      <p className="text-3xl font-bold text-green-600">12</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">Participants</h3>
                      <p className="text-3xl font-bold text-blue-600">247</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">Points</h3>
                      <p className="text-3xl font-bold text-orange-600">8.5K</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`text-center transition-all duration-1000 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Pourquoi choisir <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Satoripop Challenges</span> ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une plateforme complète pour transformer l'engagement de vos équipes avec des micro-challenges variés et motivants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Types de Challenges */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Des <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">micro-challenges</span> pour tous
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez la variété de défis disponibles pour engager vos équipes dans tous les domaines.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Heart, name: "Bien-être", color: "from-pink-500 to-rose-500", count: "25+" },
              { icon: Leaf, name: "Écologie", color: "from-green-500 to-emerald-500", count: "30+" },
              { icon: Zap, name: "Productivité", color: "from-yellow-500 to-orange-500", count: "20+" },
              { icon: Users, name: "Team Building", color: "from-blue-500 to-indigo-500", count: "15+" },
              { icon: Sparkles, name: "Créativité", color: "from-purple-500 to-pink-500", count: "18+" },
              { icon: TrendingUp, name: "Performance", color: "from-cyan-500 to-blue-500", count: "12+" }
            ].map((category, index) => (
              <div
                key={index}
                className={`group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count} défis</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">Et bien plus encore ! Créez vos propres défis personnalisés.</p>
            <Link to="/register">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105">
                Découvrir tous les défis
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-purple-500 to-indigo-600 text-white relative overflow-hidden">
        {/* Effets de fond */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Ce que disent nos clients</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Découvrez comment Satoripop Challenges transforme la culture d'entreprise de nos partenaires.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center">
                <img
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 rounded-full mx-auto mb-6 border-4 border-white/30"
                />

                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <blockquote className="text-xl italic mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div>
                  <div className="font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                  <div className="text-purple-200">{testimonials[currentTestimonial].role}</div>
                  <div className="text-purple-300 text-sm">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Indicateurs */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Call to Action */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Prêt à booster l'engagement de vos équipes ?
            </h2>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Rejoignez les entreprises qui font déjà confiance à Satoripop Challenges pour
              motiver leurs collaborateurs avec des micro-défis variés et engageants.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <span>Démarrer maintenant</span>
                </button>
              </Link>

              <Link to="/contact">
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-gray-400 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>Nous contacter</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo et description */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo size="large" />
                <span className="text-2xl font-bold text-white">Challenges</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Boostez l'engagement de vos équipes avec notre plateforme
                de micro-challenges variés et motivants.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                  <Heart className="w-5 h-5 text-red-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                  <Globe className="w-5 h-5 text-blue-400" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Plateforme</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors duration-200">Fonctionnalités</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors duration-200">Témoignages</a></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors duration-200">Connexion</Link></li>
                <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors duration-200">Inscription</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">contact@satoripop.com</li>
                <li className="text-gray-400">+33 1 23 45 67 89</li>
                <li className="text-gray-400">Paris, France</li>
              </ul>
            </div>
          </div>

          {/* Ligne de séparation */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Satoripop Challenges. Tous droits réservés.
              </p>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                  Conditions d'utilisation
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
