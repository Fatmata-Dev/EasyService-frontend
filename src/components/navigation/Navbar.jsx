import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FiMenu, FiX, FiHome, FiClipboard, FiBriefcase, FiPhone, FiUserPlus, FiUserCheck } from "react-icons/fi";
import ForgetPasswordModal from "../Modals/ForgetPasswordModal";
import LoginModal from "../Modals/LoginModal";
import SignupModal from "../Modals/SignupModal";

export default function Navbar({ defaultSection }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const links = [
    { name: "home", label: "Accueil", icon: <FiHome /> },
    { name: "services", label: "Services", icon: <FiBriefcase /> },
    { name: "testimonials", label: "Témoignages", icon: <FiClipboard /> },
    { name: "contact", label: "Contact", icon: <FiPhone /> },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (defaultSection) {
      setActiveSection("services");
    }
  }, [defaultSection]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const renderNavLink = (section) => {
    const link = links.find((link) => link.name === section);
    const isActive = activeSection === section;

    const commonClasses = `flex items-center gap-2 cursor-pointer ${windowWidth >= 1024 ? "rounded-full px-4 py-1.5" : " px-4 py-2 w-full"} transition-colors ${
      isActive ? "bg-orange-500 text-white" : "text-gray-800 hover:bg-orange-500 hover:text-white"
    }`;

    if (location.pathname !== "/") {
      return (
        <RouterLink
          to="/"
          onClick={() => {
            sessionStorage.setItem('scrollToSection', section);
            closeMenu();
          }}
          className={commonClasses}
        >
          {isMenuOpen && link.icon}
          {link.label}
        </RouterLink>
      );
    }

    return (
      <ScrollLink
        to={section}
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className={commonClasses}
        onSetActive={() => setActiveSection(section)}
        onClick={closeMenu}
        activeClass="bg-orange-500 text-white"
      >
        {isMenuOpen && link.icon}
        {link.label}
      </ScrollLink>
    );
  };

  return (
    <>
      {/* Navbar principale */}
      <nav className="bg-white fixed top-0 w-full py-4 z-50 shadow-sm">
        <div className="mx-2 sm:mx-4 lg:mx-12 py-0 flex justify-between items-center">
          {/* Logo et bouton menu */}
          <div className="flex items-center">
            <button 
              onClick={toggleMenu}
              className="lg:hidden mr-4 text-2xl text-gray-800"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              title={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
            
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
            </ScrollLink>
          </div>

          {/* Liens de navigation - Version desktop */}
          <div className="hidden lg:flex">
            <div className="flex items-center border-2 border-orange-500 rounded-full px-1 py-1">
              {links.map(({ name }) => (
                <div key={name} className="rounded-full">{renderNavLink(name)}</div>
              ))}
            </div>
          </div>

          {/* Boutons de connexion/inscription */}
          <div className="flex gap-2 sm:gap-4">
            <button
              onClick={() => {
                setShowLogin(true);
                closeMenu();
              }}
              aria-label="Connexion"
              title="Connexion"
              className={`bg-white text-orange-500 font-bold px-3 rounded-full border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300 whitespace-nowrap ${windowWidth > 448 ? "sm:px-4 py-2" : "py-3"}`}
            >
              {windowWidth > 448 ? "Connexion" : <FiUserCheck />}
            </button>
            <button
              onClick={() => {
                setShowSignup(true);
                closeMenu();
              }}
              aria-label="Inscription"
              title="Inscription"
              className={`bg-white text-orange-500 font-bold px-3 rounded-full border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300 whitespace-nowrap ${windowWidth > 448 ? "sm:px-4 py-2" : "py-3"}`}
            >
              {windowWidth > 448 ? "Inscription" : <FiUserPlus />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        } lg:hidden`}
        onClick={closeMenu}
      />

      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex justify-between items-center">
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              <img src={logo} alt="Easy Service Logo" aria-label="Logo de Easy Service" className="h-12 w-32" />
            </ScrollLink>
            <button 
              onClick={closeMenu} 
              className="text-2xl text-gray-800"
              aria-label="Fermer le menu"
              title="Fermer le menu"
            >
              <FiX />
            </button>
          </div>
          
          <nav className="flex-1 space-y-2">
            {links.map(({ name }) => (
              <div key={name} className="w-full">
                {renderNavLink(name)}
              </div>
            ))}
          </nav>

          <div className="p-4 mt-auto pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => {
                setShowLogin(true);
                closeMenu();
              }}
              aria-label="Connexion"
              title="Connexion"
              className="flex items-center justify-center gap-2 w-full text-center bg-white text-orange-500 font-bold px-4 py-2 rounded-full border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              <FiUserCheck /> Connexion
            </button>
            <button
              onClick={() => {
                setShowSignup(true);
                closeMenu();
              }}
              aria-label="Inscription"
              title="Inscription"
              className="flex items-center justify-center gap-2 w-full text-center bg-white text-orange-500 font-bold px-4 py-2 rounded-full border-2 border-orange-500 hover:bg-orange-500 hover:text-white transition-colors duration-300"
            >
              <FiUserPlus /> Inscription
            </button>
          </div>
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
    </>
  );
}