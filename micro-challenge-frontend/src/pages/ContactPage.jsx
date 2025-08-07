import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 px-8 py-16">
      <div className="max-w-xl mx-auto text-gray-800">
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="mb-4 text-lg">
          Une question, une suggestion ou une envie de collaborer ? Écrivez-nous !
        </p>
        <p className="text-lg mb-2">
          📧 <a href="mailto:support@satoripop.com" className="text-green-600 underline">support@satoripop.com</a>
        </p>
        <p className="text-lg">
          💼 Suivez-nous sur <a href="https://www.linkedin.com/company/satoripop" target="_blank" rel="noreferrer" className="text-green-600 underline">LinkedIn</a>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
