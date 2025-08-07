import React from 'react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 px-8 py-16">
      <div className="max-w-3xl mx-auto text-gray-800">
        <h1 className="text-4xl font-bold mb-6">À propos de nous</h1>
        <p className="mb-4 text-lg">
          Satoripop Challenges est une plateforme qui encourage l'engagement écologique,
          solidaire et créatif au sein des entreprises et des communautés.
        </p>
        <p className="mb-4 text-lg">
          Notre objectif est de proposer des micro-challenges amusants et impactants,
          favorisant la cohésion d'équipe et les actions positives pour l’environnement
          et la société.
        </p>
        <p className="text-lg">
          Ce projet a été développé avec passion par une équipe engagée, souhaitant
          rendre chaque petit geste accessible et valorisé.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
