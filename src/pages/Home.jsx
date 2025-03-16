// src/pages/Home.jsx
import { Link } from "react-scroll";
import logo from "../assets/logo.png";
import React from "react";
import { useState, useEffect } from "react";
// import Navbar from '../components/navigation/Navbar';
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";
import FooterSection from "../components/sections/FooterSection";
import { FiMenu } from "react-icons/fi";
// import ContactSection from '../components/sections/ContactSection';
// import { servicesData, testimonialsData } from '../../components/data/content'; // Créez ce fichier si nécessaire

// Ajoutez ces données avant la fonction Home
const testimonialsData = [
  {
    name: "Floyd Miles",
    text: "Service exceptionnel...",
    rating: 5,
  },
  {
    name: "Ronald Richards",
    text: "Intervention rapide...",
    rating: 4,
  },
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
    rating: 4,
  },
  {
    id: 3,
    name: "Interventions",
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4,
  },
  {
    id: 4,
    name: "Interventions",
    description: "Interventions rapides et efficaces",
    price: 10,
    rating: 4,
  },
];

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("Navbar");
      if (navbar) {
        navbar.style.position = "sticky";
        if (window.scrollY > 50) {
          navbar.classList.add("shadow-md");
        } else {
          navbar.classList.remove("shadow-md");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Navbar */}
      <nav
        id="Navbar"
        className="bg-white relative top-0 w-full m-0 p-0 z-50 transition-all duration-300"
      >
        <div className="mx-2 sm:mx-4 lg:mx-12 py-0 flex items-center justify-between">
          {/* Logo décalé à gauche */}
          <div className="flex cursor-pointer top-0 left-0 m-4">
            {/* Icone menu hamburger */}
            <FiMenu className="text-3xl lg:hidden" />{" "}
            {/* Augmentez mr-8 pour plus d'espace */}
            <Link
              to="home"
              spy={true}
              smooth={true}
              className="flex items-center hover:opacity-80 transition-opacity hidden lg:flex"
            >
              <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
            </Link>
          </div>

          {/* Liens centrés */}
          <div className="mx-auto flex justify-center hidden lg:flex">
            <div className="flex items-center border-2 border-orange-500 rounded-full px-6 py-1 ml-8">
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
          <div className="flex space-x-4 ml-auto">
            {" "}
            {/* ml-auto pousse vers la droite */}
            <button
              onClick={() => setShowSignup(true)}
              className="bg-white text-orange-500 px-2 py-1 sm:px-6 sm:py-2 rounded 
              border-2 border-orange-500 hover:bg-orange-500 
              hover:text-white transition-colors duration-300"
            >
              Inscription
            </button>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-orange-500 px-2 py-1 sm:px-6 sm:py-2 rounded
              border-2 border-orange-500 hover:bg-orange-500 
              hover:text-white transition-colors duration-300
              
              "
            >
              Connexion
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showLogin && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLogin(false)}
        >
          <div
            className="bg-white rounded-lg px-8 py-4 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center uppercase">
              Connexion
            </h2>
            <form className="">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-bold text-gray-700"
                >
                  Email
                </label>
                <div>
                  <input
                    placeholder="Votre email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="given-email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block font-bold text-gray-700"
                >
                  Mot de passe
                </label>
                <div>
                  <input
                    placeholder="Votre Mot de passe"
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-2 my-4 rounded hover:bg-orange-600"
              >
                Se connecter
              </button>
              <div className="flex justify-between">
                <Link
                  className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
                  onClick={() => {
                    setShowLogin(false);
                    setShowSignup(true);
                  }}
                >
                  Inscription
                </Link>
                <Link
                  className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
                  onClick={() => {
                    setShowLogin(false);
                    setShowForgetPassword(true);
                  }}
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSignup && (
        <div
          onClick={() => setShowSignup(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="bg-white rounded-lg px-8 py-4 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center uppercase">
              Inscription
            </h2>
            <form className="">
              <div className="mb-4">
                <label htmlFor="nom" className="block font-bold text-gray-700">
                  Nom complet
                </label>
                <div>
                  <input
                    placeholder="Votre prénom et nom"
                    id="nom"
                    name="nom"
                    type="text"
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-bold text-gray-700"
                >
                  Email
                </label>
                <div>
                  <input
                    placeholder="Votre email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="given-email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block font-bold text-gray-700"
                >
                  Mot de passe
                </label>
                <div>
                  <input
                    placeholder="Votre Mot de passe"
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div class="flex items-center">
                <input
                  id="link-checkbox"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                />
                <label
                  for="link-checkbox"
                  class="ms-2 text-md font-medium text-gray-700"
                >
                  J&apos;accepte les{" "}
                  <a
                    href="#"
                    class="text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    termes et la politique
                  </a>
                  .
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-2 my-4 rounded hover:bg-orange-600"
              >
                S&apos;inscrire
              </button>
              <p>
                Vous avez déjà un compte ?{" "}
                <Link
                  onClick={() => {
                    setShowSignup(false);
                    setShowLogin(true);
                  }}
                  className="text-orange-500 font-bold hover:text-orange-700"
                >
                  {" "}
                  Se connecter
                </Link>
              </p>
            </form>
            {/* <button 
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button> */}
          </div>
        </div>
      )}

      {showForgetPassword && (
        <div
          onClick={() => setShowForgetPassword(false)}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div
            className="bg-white rounded-lg px-8 py-4 w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg">Mot de passe oublié ?</h3>
            <form className="">
              <p className="my-2">
                Entrez votre adresse e-mail ci-dessous et nous vous envoyons des
                instructions sur la façon de modifier votre mot de passe.
              </p>

              <div className="mb-2">
                <label
                  htmlFor="email"
                  className="block font-bold text-gray-700"
                >
                  Email
                </label>
                <div>
                  <input
                    placeholder="Votre email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="given-email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white font-bold py-2 my-4 rounded hover:bg-orange-600"
              >
                Envoyer
              </button>
              <div className="flex justify-center">
                <p>
                  Revenir à la page de{" "}
                  <Link
                    className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
                    onClick={() => {
                      setShowForgetPassword(false);
                      setShowLogin(true);
                    }}
                  >
                    {" "}
                    connexion
                  </Link>{" "}
                </p>
              </div>
            </form>
            {/* <button 
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button> */}
          </div>
        </div>
      )}

      {/* ... Le reste de vos sections ... */}
      <HeroSection />
      <ServicesSection services={servicesData} />
      <TestimonialsSection testimonials={testimonialsData} />
      <ContactSection />
      <FooterSection />

      {/* <ContactSection /> */}
    </div>
  );
}
