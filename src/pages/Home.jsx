import React, { useState, useEffect } from "react";
import HeroSection from "../components/sections/HeroSection";
import ServicesSection from "../components/sections/ServicesSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import ContactSection from "../components/sections/ContactSection";
import FooterSection from "../components/sections/FooterSection";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgetPasswordModal from "../components/Modals/ForgetPasswordModal";
import Navbar from "../components/navigation/Navbar";
import { FaLongArrowAltRight } from "react-icons/fa";
import { scroller } from "react-scroll";

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
    const sectionToScroll = sessionStorage.getItem('scrollToSection');
    if (sectionToScroll) {
      scroller.scrollTo(sectionToScroll, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        // offset: -70
      });
      sessionStorage.removeItem('scrollToSection');
    }
  }, []);

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
      <Navbar />

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
          <div className="flex justify-end items-center mt-5 lg:px-8 mx-4">
            <span
              to="home"
              className="text-orange-500 cursor-pointer font-bold flex items-center gap-2"
              onClick={() => setShowLogin(true)}
            >
              Voir toutes les services{" "}
              <FaLongArrowAltRight className="text-xl" />
            </span>
          </div>
      <TestimonialsSection testimonials={testimonialsData} />
      <ContactSection />
      <FooterSection />
    </div>
  );
}
