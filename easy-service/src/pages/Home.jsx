// src/pages/Home.jsx
import { Link } from 'react-scroll';
import logo from '../assets/logo.png';
import React from 'react';
import { useState } from 'react';
// import Navbar from '../components/navigation/Navbar';
import HeroSection from '../components/sections/HeroSection';
import ServicesSection from '../components/sections/ServicesSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
// import ContactSection from '../components/sections/ContactSection';
// import { servicesData, testimonialsData } from '../../components/data/content'; // Créez ce fichier si nécessaire


// Ajoutez ces données avant la fonction Home
const testimonialsData = [
  {
    name: "Floyd Miles",
    text: "Service exceptionnel...",
    rating: 5
  },
  {
    name: "Ronald Richards",
    text: "Intervention rapide...",
    rating: 4
  }
];

const servicesData = [
  {
    id: 1,
    name: "Interventions",  
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4,
  },
  {
    id: 2,
    name: "Interventions",  
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4
  },
  {
    id: 3,
    name: "Interventions",  
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4
  },
  {
    id: 4,
    name: "Interventions",  
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4,
  },
]

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-0 flex items-center justify-between">
           {/* Logo décalé à gauche */}
          <div className="flex cursor-pointer top-0 left-0 p-4 mr-8"> {/* Augmentez mr-8 pour plus d'espace */}
          <Link 
            to="home" 
            spy={true} 
            smooth={true} 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src={logo}
              alt="Easy Service Logo" 
              className="h-12 w-32"
            />
          </Link>
          </div>

         {/* Liens centrés */}
         <div className="flex-1 flex justify-center">
          <div className="flex space-x-4 items-center border-2 border-orange-500 rounded-full px-6 py-1 ml-8">
            <Link 
              to="home" 
              spy={true} 
              smooth={true} 
              activeClass="bg-orange-500 text-white"
              className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
                        hover:bg-orange-500 hover:text-white transition-colors"
            >
              Accueil
            </Link>
            <Link 
              to="services" 
              spy={true} 
              smooth={true} 
              activeClass="bg-orange-500 text-white"
              className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
              hover:bg-orange-500 hover:text-white transition-colors"
            >
              Services
            </Link>
            <Link 
              to="testimonials" 
              spy={true} 
              smooth={true} 
              activeClass="bg-orange-500 text-white"
              className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
              hover:bg-orange-500 hover:text-white transition-colors"
            >
              Témoignages
            </Link>
            <Link 
              to="contact" 
              spy={true} 
              smooth={true} 
              activeClass="bg-orange-500 text-white"
              className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
              hover:bg-orange-500 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
          </div>

          {/* Boutons décalés à droite */}
          <div className="flex space-x-4 ml-auto"> {/* ml-auto pousse vers la droite */}
            <button 
              onClick={() => setShowSignup(true)}
              className="bg-white text-orange-500 px-6 py-2 rounded shadow-md 
              border-2 border-orange-500 hover:bg-orange-500 
              hover:text-white transition-colors duration-300"
            >
              Inscription
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              className="bg-white text-orange-500 px-6 py-2 
              border-2 border-orange-500 hover:bg-orange-500 
              hover:text-white transition-colors duration-300
              rounded shadow-[0_4px_6px_-1px_rgba(249,115,22,0.3)]
              "
            >
              Connexion
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">Connexion</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Mot de passe</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                Se connecter
              </button>
            </form>
            <button 
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {showSignup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96">
            <h2 className="text-2xl font-bold mb-6">Inscription</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Nom complet</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Mot de passe</label>
                <input type="password" className="w-full p-2 border rounded" />
              </div>
              <button 
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                S'inscrire
              </button>
            </form>
            <button 
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ... Le reste de vos sections ... */}
      <HeroSection />
      <ServicesSection services={servicesData} />
      <TestimonialsSection testimonials={testimonialsData} />
      
      {/* <ContactSection /> */}
    </div>
    
  );
}
