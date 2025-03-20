import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import logo from "../assets/logo.png";
import { FiMenu } from "react-icons/fi";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";
import FooterSection from "../components/sections/FooterSection";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgetPasswordModal from "../components/Modals/ForgetPasswordModal";

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
  const [activeSection, setActiveSection] = useState("home");

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
        className="bg-white relative top-0 w-full m-0 py-4 z-50 transition-all duration-300"
      >
        <div className="mx-2 sm:mx-4 lg:mx-12 py-0 flex items-center justify-between">
          <div className="flex cursor-pointer top-0 left-0">
            <FiMenu className="text-3xl lg:hidden" />
            <Link
              to="home"
              spy={true}
              smooth={true}
              className="flex items-center hover:opacity-80 transition-opacity hidden lg:flex"
            >
              <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
            </Link>
          </div>
          <div className="flex justify-center hidden lg:flex">
            <div className="flex items-center border-2 border-orange-500 rounded-full px-2 py-1">
              <Link
                to="home"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                  activeSection === "home" ? "bg-orange-500 text-white" : ""
                }`}
                onSetActive={() => setActiveSection("home")}
                activeClass="bg-orange-500 text-white"
              >
                Accueil
              </Link>
              <Link
                to="services"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                  activeSection === "services" ? "bg-orange-500 text-white" : ""
                }`}
                onSetActive={() => setActiveSection("services")}
                activeClass="bg-orange-500 text-white"
              >
                Services
              </Link>
              <Link
                to="testimonials"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                  activeSection === "testimonials" ? "bg-orange-500 text-white" : ""
                }`}
                onSetActive={() => setActiveSection("testimonials")}
                activeClass="bg-orange-500 text-white"
              >
                Témoignages
              </Link>
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                  activeSection === "contact" ? "bg-orange-500 text-white" : ""
                }`}
                onSetActive={() => setActiveSection("contact")}
                activeClass="bg-orange-500 text-white"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-orange-500 font-bold px-2 py-1 sm:px-6 sm:py-2 rounded border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              Connexion
            </button>
            <button
              onClick={() => setShowSignup(true)}
              className="bg-white text-orange-500 font-bold px-2 py-1 sm:px-6 sm:py-2 rounded border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              Inscription
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onSwitchToForgetPassword={() => {
            setShowLogin(false);
            setShowForgetPassword(true);
          }}
        />
      )}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
      {showForgetPassword && (
        <ForgetPasswordModal
          onClose={() => setShowForgetPassword(false)}
          onSwitchToLogin={() => {
            setShowForgetPassword(false);
            setShowLogin(true);
          }}
        />
      )}

      {/* Sections */}
      <HeroSection />
      <ServicesSection services={servicesData} />
      <TestimonialsSection testimonials={testimonialsData} />
      <ContactSection />
      <FooterSection />
    </div>
  );
}