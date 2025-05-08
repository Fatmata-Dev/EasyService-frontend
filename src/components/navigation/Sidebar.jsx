import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import ProfilSignature from "../../assets/ProfileSignature.png";
import {
  FiHome,
  FiTool,
  FiMessageCircle,
  FiStar,
  FiPhone,
  FiBriefcase,
  FiClipboard,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";

const Sidebar = ({ user }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const prenom = user?.prenom;
  const nom = user?.nom;
  let links = null;
  const navigate = useNavigate();

  if(user.role === "admin") {
    links = [
      { name: "dashboard", label: "Dashboard", icon: <FiHome /> },
      { name: "services", label: "Services", icon: <FiBriefcase /> },
      { name: "demandes", label: "Demandes", icon: <FiClipboard /> },
      { name: "messages", label: "Messages", icon: <FiMessageSquare /> },
      { name: "permissions", label: "Permissions", icon: <FiUsers /> },
      { name: "avis", label: "Avis", icon: <FiStar /> },
    ];
  } else if(user.role === "client") {
    links = [
      { name: "dashboard", label: "Dashboard", icon: <FiHome /> },
      { name: "services", label: "Services", icon: <FiBriefcase /> },
      { name: "demandes", label: "Demandes", icon: <FiClipboard /> },
      { name: "messages", label: "Messages", icon: <FiMessageCircle /> },
      { name: "avis", label: "Avis", icon: <FiStar /> },
      { name: "contact", label: "Contact", icon: <FiPhone /> },
    ];
  } else if(user.role === "technicien") {
    links = [
      { name: "dashboard", label: "Dashboard", icon: <FiHome /> },
      { name: "interventions", label: "Interventions", icon: <FiTool /> },
      { name: "messages", label: "Messages", icon: <FiMessageCircle /> },
      // { name: "avis", label: "Avis", icon: <FiStar /> },
      { name: "contact", label: "Contact", icon: <FiPhone /> },
    ];
  }

  return (
      <div className="bg-gray-50 w-[220px] fixed z-9999 top-0 left-0 h-full pt-4 flex flex-col justify-between hidden md:flex">
        {" "}
        {/* Navigation avec liens centrés */}
        <nav className="space-y-2 flex-1 mt-16 text-md text-left">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={`/${user.role}/${link.name}`}
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
        <div className="flex items-center space-x-3 p-3 border-t mt-4 hover:bg-gray-200 cursor-pointer" onClick={() => navigate(`/${user?.role}/profil/${user?._id}`)}>
          <img
            src={user?.image?.url || `https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=random`}
            alt="Signature professionnelle"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm capitalize">
              {prenom && prenom.length > 3 ? `${prenom.slice(0, 1) || ""}. ` : `${prenom}`} {" "}
              { nom && nom.length > 8 ? `${nom.charAt(0).toUpperCase() || ""}. ` : `${nom}`}{" "}
              ({user.role && user.role.length > 6 ? `${user.role.slice(0, 4) || ""}.` : `${user.role}`})
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

export default Sidebar;
