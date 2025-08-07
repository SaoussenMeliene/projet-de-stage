import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Développeuse Senior",
    text: "Les micro-challenges ont transformé notre façon de collaborer. C'est motivant et ludique ! J'ai découvert de nouvelles compétences.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    name: "Thomas Dubois",
    role: "Chef de projet",
    text: "Une excellente initiative pour renforcer l'esprit d'équipe et l'innovation. Les résultats sont visibles rapidement.",
    img: "https://randomuser.me/api/portraits/men/46.jpg",
    rating: 5,
  },
  {
    name: "Marie Leroy",
    role: "Designer UX",
    text: "J'adore pouvoir partager mes réalisations et voir celles de mes collègues ! L'interface est intuitive et moderne.",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1B1A2F] mb-4">
            Ce que disent nos collaborateurs
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les retours de ceux qui utilisent déjà la plateforme
          </p>
        </div>

        {/* Cartes Témoignages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md border border-gray-100 
                         hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-[#1B1A2F] text-lg">{t.name}</h4>
                  <p className="text-gray600 text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed mb-4">
                "{t.text}"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
