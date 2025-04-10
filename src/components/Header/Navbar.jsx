import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FiMenu } from "react-icons/fi";
import ForgetPasswordModal from "../Modals/ForgetPasswordModal";
import LoginModal from "../Modals/LoginModal";
import SignupModal from "../Modals/SignupModal";

export default function Navbar({ defaultSection }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    if (defaultSection) {
      setActiveSection("services");
    }
  }, [defaultSection]);

  // Fonction pour gérer la navigation
  (section) => {
    if (location.pathname !== "/") {
      // Si nous ne sommes pas sur la page d'accueil
      return (
        <RouterLink 
          to="/" 
          onClick={() => {
            // Stocker la section à laquelle nous voulons aller
            sessionStorage.setItem('scrollToSection', section);
          }}
        />
      );
    }
    // Si nous sommes déjà sur la page d'accueil, utiliser le défilement normal
    return (
      <ScrollLink
        to={section}
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
          activeSection === section ? "bg-orange-500 text-white" : ""
        }`}
        onSetActive={() => setActiveSection(section)}
        activeClass="bg-orange-500 text-white"
      />
    );
  };

  return (
    <nav
      id="Navbar"
      className="bg-white relative top-0 w-full m-0 py-4 z-50 transition-all duration-300"
    >
        <div className="mx-2 sm:mx-4 lg:mx-12 py-0 flex items-center justify-between">
        <div className="flex cursor-pointer top-0 left-0">
          <FiMenu className="text-3xl lg:hidden" />
          <RouterLink
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity hidden lg:flex"
          >
            <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
          </RouterLink>
        </div>

        <div className="flex justify-center hidden lg:flex">
          <div className="flex items-center border-2 border-orange-500 rounded-full px-2 py-2">
            {["home", "services", "testimonials", "contact"].map((section) => (
              <div key={section}>
                {location.pathname === "/" ? (
                  <ScrollLink
                    to={section}
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                      activeSection === section ? "bg-orange-500 text-white" : ""
                    }`}
                    onSetActive={() => setActiveSection(section)}
                    activeClass="bg-orange-500 text-white"
                  >
                    {section === "home" && "Accueil"}
                    {section === "services" && "Services"}
                    {section === "testimonials" && "Témoignages"}
                    {section === "contact" && "Contact"}
                  </ScrollLink>
                ) : (
                  <RouterLink
                    to="/"
                    onClick={() => sessionStorage.setItem('scrollToSection', section)}
                    className={`text-gray-800 cursor-pointer px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors ${
                      activeSection === section ? "bg-orange-500 text-white" : ""
                    }`}
                  >
                    {section === "home" && "Accueil"}
                    {section === "services" && "Services"}
                    {section === "testimonials" && "Témoignages"}
                    {section === "contact" && "Contact"}
                  </RouterLink>
                )}
              </div>
            ))}
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
    </nav>
  );
}