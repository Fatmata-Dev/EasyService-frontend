import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfileSignature from "../../assets/ProfileSignature.png";

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const prenom = localStorage.getItem("authPrenom");
  const nom = localStorage.getItem("authNom");

  return (
<div className="bg-gray-50 w-[220px] fixed z-9999 top-0 left-0 h-full py-4 flex flex-col justify-between  hidden md:flex">      {/* Navigation avec liens centrés */}
      <nav className="space-y-2 flex-1 mt-16 text-md">
        {["dashboard", "services", "demandes", "messages", "avisClient", "contact"].map((tab) => (
          <NavLink
            key={tab}
            to={`/client/${tab}`}
            className={({ isActive }) =>
              `block p-1 w-full text-center font-semibold text-gray-800 cursor-pointer px-4 py-2 transition-colors ${
                isActive ? "bg-orange-500 text-white" : "hover:bg-orange-500 hover:text-white"
              }`
            }
            onClick={() => setActiveSection(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </NavLink>
        ))}
      </nav>

      {/* Profil utilisateur en bas */}
      <div className="flex items-center space-x-3 p-3 border-t mt-4">
        <img
          src={ProfileSignature}
          alt="Signature professionnelle"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="font-semibold text-sm">{prenom && nom ? `${prenom} ${nom}` : "Utilisateur non connecté"}</p>
          <p className="text-gray-500 text-xs flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> en ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;