import { useState } from "react";
import ProfileSignature from "../../assets/ProfileSignature.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import React from "react";
import { FiMenu } from "react-icons/fi";
import toast from "react-hot-toast";

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    
    localStorage.removeItem("authToken"); // Supprime le token d'authentification
    localStorage.removeItem("user"); // Supprime le token d'authentification
    navigate("/"); // Redirige vers la racine
    toast.success("Déconnexion réussis");
  };

  // Icône personnalisée fournie
  const CustomIcon = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className="cursor-pointer hover:text-orange-500"
      onClick={handleLogout}
    >
      <g id="log-out">
        <path
          d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 17L21 12L16 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  return (
    <div className="bg-gray-50 sticky top-0 z-10 p-2 w-full">
      <div className="flex items-center justify-between mx-3">
        <FiMenu className="text-3xl md:hidden" />
        <Link to="home" className="ml-8 hidden md:block">
          <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
        </Link>
        {/* Barre de recherche */}
        <div className="flex-1 max-w-[200px] lg:max-w-sm mx-4 md:mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 36 40"
                className="text-gray-500"
              >
                <path
                  d="M15.1199 2.3999C8.36707 2.3999 2.87988 8.49678 2.87988 15.9999C2.87988 23.503 8.36707 29.5999 15.1199 29.5999C17.7918 29.5999 20.2611 28.6437 22.2749 27.0249L31.7474 37.5249L33.7724 35.2749L24.4124 24.8499C26.2518 22.4687 27.3599 19.378 27.3599 15.9999C27.3599 8.49678 21.8727 2.3999 15.1199 2.3999ZM15.1199 3.9999C21.0936 3.9999 25.9199 9.3624 25.9199 15.9999C25.9199 22.6374 21.0936 27.9999 15.1199 27.9999C9.14613 27.9999 4.31988 22.6374 4.31988 15.9999C4.31988 9.3624 9.14613 3.9999 15.1199 3.9999Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Section icônes */}
        <div className="flex items-center gap-5">
          {/* Icône Notification */}
          <button className="relative text-gray-600 hover:text-orange-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Image utilisateur */}
          <img
            src={ProfileSignature}
            alt="Profil utilisateur"
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Icône personnalisée pour la déconnexion */}
          <CustomIcon />
        </div>
      </div>
    </div>
  );
};

export default Header;