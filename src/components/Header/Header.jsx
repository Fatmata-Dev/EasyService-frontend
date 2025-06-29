import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FiMenu, FiSearch } from "react-icons/fi";
import { useGetReceivedMessagesQuery } from "../../API/messagesApi";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useLazyGetSearchQuery } from "../../API/searchApi";

const Header = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { data: messagesResponse = {} } = useGetReceivedMessagesQuery();
  const { sideBarOpen, toggleSidebar } = useContext(AuthContext);
  const [triggerSearch, { data: searchData }] = useLazyGetSearchQuery();
  //console.log("value : " + sideBarOpen);
  //console.log(searchData);
  const email = user?.email;

  // Extraction des messages depuis la réponse avec une vérification robuste
  const messagesData = messagesResponse.data || [];

  // Compte le nombre de messages non lus de manière plus fiable
  const unreadMessagesCount = messagesData.reduce((count, message) => {
    const isUnread = message.destinataires?.some(destinataire => 
      destinataire?.email === user?.email && !destinataire.lu
    );
    return isUnread ? count + 1 : count;
  }, 0);

  
const handleSearchChange = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  
  if (query.trim()) {
    try {
      await triggerSearch({ query: encodeURIComponent(query), email });
      setShowResults(true);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
  } else {
    setShowResults(false);
    setSearchResults([]);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${user?.role}/search`, { state: { results: searchData, query: searchQuery } });
      setSearchQuery('');
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData);
    }
  }, [searchData]);


  const handleLogout = async () => {
    try {
      // await logout();
      navigate("/deconnexion");
      // toast.success("Déconnexion réussie", { duration: 1000 });
      // Optionnel: Rediriger immédiatement si nécessaire
      // navigate("/");
    } catch (error) {
      // toast.error("Erreur lors de la déconnexion");
      console.error("Logout error:", error);
    }
  };

  return (
    <>
    {showResults && (
      <div 
        className="fixed inset-0 bg-transparent z-10"
        onClick={() => setShowResults(false)} 
      />
    )}
      <header className="bg-gray-50 sticky top-0 z-10 p-2 w-full shadow md:shadow-none">
        <div className="flex items-center justify-between mx-3">
          <FiMenu className="text-2xl md:hidden cursor-pointer" onClick={toggleSidebar} />
          
          <Link to="dashboard" className="ml-8 hidden md:block">
            <img 
              src={logo} 
              alt="Easy Service Logo" 
              className="h-12 w-32" 
              key="logo" // Ajout d'une clé unique
            />
          </Link>

          {/* Barre de recherche améliorée */}
          <form 
            onSubmit={handleSubmit} 
            className="flex-1 w-full sm:max-w-[300px] lg:max-w-sm mx-4 md:mx-auto relative"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery || ""}
                name="search"
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <FiSearch className="text-gray-500 text-xl" />
              </button>
            </div>
            
            {/* Affichage des résultats en temps réel */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {searchResults.slice(0, 5).map((result, index) => (
                  <div 
                    key={`${result.type}-${result._id}-${index}`}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      // Navigation selon le type de résultat
                      if (result.type === 'service') {
                        navigate(`/${user?.role}/services/${result._id}`);
                      } else if (result.type === 'message') {
                        navigate(`/${user?.role}/messages/${result._id}`);
                      } else if (result.type === "demande") {
                        navigate(`/${user?.role}/demandes/${result._id}`);
                      }
                      
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                  >
                    <div className="font-medium line-clamp-1 capitalize">{result.type === 'demande' && result?.numeroDemande || result?.nom}</div>
                    <div className="font-medium line-clamp-1">{result.type === 'message' && result?.expediteur?.email}</div>
                    <div className="line-clamp-1">{result.type === 'message' && result?.contenu}</div>
                    <div className="font-semibold line-clamp-1 capitalize text-gray-500">{result?.service?.nom}</div>
                    <div className="text-sm text-gray-500 line-clamp-1 capitalize">{(result.type === 'demande' && user.role === "technicien") ? "Intervention" : result.type}</div>
                  </div>
                ))}
                {searchResults.length > 5 && (
                  <div 
                    className="p-3 bg-gray-50 text-center text-sm text-orange-500 font-medium cursor-pointer"
                    onClick={() => {
                      navigate(`/${user?.role}/search`, { state: { results: searchResults, query: searchQuery } });
                      setShowResults(false);
                    }}
                  >
                    Voir tous les résultats ({searchResults.length})
                  </div>
                )}
              </div>
            )}
          </form>

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
                  aria-label={`Vous avez ${unreadMessagesCount} messages non lus`}
                  className="absolute -top-2 -right-1 inline-block w-4 h-4 bg-orange-500 rounded-full text-white text-xs flex items-center justify-center"
                  key={`unread-count-${unreadMessagesCount}`} // Clé unique basée sur le count
                >
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Image utilisateur */}
            <img
              src={user?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.prenom + " " + user?.nom)}&background=random`}
              alt="Profil utilisateur"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hidden sm:block"
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
      </header>
    </>
  );
};

export default Header;