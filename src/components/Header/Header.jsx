import { useState } from "react";
import ProfileSignature from "../../assets/ProfileSignature.png";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useGetReceivedMessagesQuery } from "../../API/messagesApi";
import { useAuth } from "../../context/useAuth";
import toast from "react-hot-toast";

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { data: messagesResponse = {} } = useGetReceivedMessagesQuery();
  const { logout } = useAuth();

  // Extraction des messages depuis la réponse avec une vérification robuste
  const messagesData = messagesResponse.data || [];

  // Compte le nombre de messages non lus de manière plus fiable
  const unreadMessagesCount = messagesData.reduce((count, message) => {
    const isUnread = message.destinataires?.some(destinataire => 
      destinataire?.email === user?.email && !destinataire.lu
    );
    return isUnread ? count + 1 : count;
  }, 0);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      // Optionnel: Rediriger immédiatement si nécessaire
      // navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="bg-gray-50 sticky top-0 z-10 p-2 w-full">
      <div className="flex items-center justify-between mx-3">
        <FiMenu className="text-2xl md:hidden cursor-pointer" />
        
        <Link to="dashboard" className="ml-8 hidden md:block">
          <img 
            src={logo} 
            alt="Easy Service Logo" 
            className="h-12 w-32" 
            key="logo" // Ajout d'une clé unique
          />
        </Link>

        {/* Barre de recherche améliorée */}
        <div className="flex-1 max-w-[200px] lg:max-w-sm mx-4 md:mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              key="search-input" // Clé unique
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <FiSearch className="text-gray-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Section icônes */}
        <div className="flex items-center gap-5">
          {/* Bouton Notification avec badge */}
          <button 
            className="relative text-gray-600 hover:text-orange-500"
            onClick={() => navigate(`/${user?.role}/messages`)}
            key="notification-btn" // Clé unique
          >
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
            {unreadMessagesCount > 0 && (
              <span 
                className="absolute -top-2 -right-1 inline-block w-4 h-4 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center"
                key={`unread-count-${unreadMessagesCount}`} // Clé unique basée sur le count
              >
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Image utilisateur */}
          <img
            src={user?.image?.url || `https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=random`}
            alt="Profil utilisateur"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={() => navigate(`/${user?.role}/profil/${user?._id}`)}
            key="user-avatar" // Clé unique
          />

          {/* Bouton de déconnexion */}
          <button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-orange-500"
            key="logout-btn" // Clé unique
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="cursor-pointer"
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;