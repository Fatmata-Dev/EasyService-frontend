import { NavLink } from "react-router-dom";
import { useState } from "react";
import ProfileSignature from "../../assets/ProfileSignature.png";
import {
  FiHome,
  FiTool,
  FiMessageCircle,
  FiStar,
  FiPhone,
} from "react-icons/fi";

const SidebarTechnicien = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const userData = JSON.parse(localStorage.getItem("user"));
  const prenom = userData.prenom;
  const nom = userData.nom;
  const links = [
    { name: "dashboard", label: "Dashboard", icon: <FiHome /> },
    { name: "interventions", label: "Interventions", icon: <FiTool /> },
    { name: "messages", label: "Messages", icon: <FiMessageCircle /> },
    { name: "avis", label: "Avis", icon: <FiStar /> },
    { name: "contact", label: "Contact", icon: <FiPhone /> },
  ];

  return (
    <div className="bg-gray-50 w-[220px] fixed z-9999 top-0 left-0 h-full py-4 flex flex-col justify-between  hidden md:flex">
      {" "}
      {/* Navigation avec liens centrés */}
      <nav className="space-y-2 flex-1 mt-16 text-md text-left">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={`/technicien/${link.name}`}
            className={({ isActive }) =>
              `flex items-center gap-2 p-1 w-full text-left font-semibold text-gray-800 cursor-pointer px-4 py-2 transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "hover:bg-orange-500 hover:text-white"
              }`
            }
            onClick={() => setActiveSection(link.name)}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
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
          <p className="font-semibold text-sm">
            {prenom && nom ? `${prenom} ${nom}` : "Utilisateur non connecté"}
          </p>
          <p className="text-gray-500 text-xs flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> en
            ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarTechnicien;
