import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import ProfileSignature from "../../assets/ProfileSignature.png";
// Remplace par le bon chemin de ton image

const Sidebar = () => {
  return (
    <div className="bg-white w-67 fixed h-full p-4 shadow-lg flex flex-col justify-between">
      {/* Logo centré */}
      <Link
        to="home"
        className="flex justify-center items-center hover:opacity-80 transition-opacity mb-6 hidden lg:flex"
      >
        <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
      </Link>

      {/* Navigation avec liens centrés */}
      <nav className="space-y-2 flex-1">
        {["dashboard", "services", "demandes", "messages", "avis", "contact"].map((tab) => (
          <Link
            key={tab}
            to={`/dashboard/${tab}`}
            className="block p-1 w-full hover:bg-orange-500 hover:text-white font-semibold text-center"
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        ))}
      </nav>

      {/* Profil utilisateur en bas */}
      <div className="flex items-center space-x-3 p-3 border-t mt-4">
        <img src={ProfileSignature} alt="Signature professionnelle" className="w-16 h-16 rounded-full" />
        <div>
          <p className="font-semibold text-sm">Mouhamed Ndiaye</p>
          <p className="text-gray-500 text-xs flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> ligne
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
