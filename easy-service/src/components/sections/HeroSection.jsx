import React from 'react';
import { Link } from 'react-scroll';

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen pt-20 flex items-center bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
          Bienvenue sur EasyService
        </h1>
        <p className="text-xl mb-8 text-gray-600">
          La plateforme idéale pour vos besoins en services techniques
        </p>
        <Link
          to="services"
          smooth={true}
          className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full 
                    hover:bg-orange-600 transition-colors cursor-pointer"
        >
          Découvrir nos services
        </Link>
      </div>
    </section>
  );
}