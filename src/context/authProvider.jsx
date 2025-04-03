import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

// Création du contexte d'authentification
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [lastAuthorizedPath, setLastAuthorizedPath] = useState("/");
  const navigate = useNavigate();
  const location = useLocation();

  // Fonction pour vérifier si un rôle a accès à une route donnée
  const checkAccess = (path, role) => {
    // Définissez ici vos règles d'accès
    const accessRules = {
      '/admin': ['admin'],
      '/client': ['client'],
      '/technicien': ['technicien'],
      // Ajoutez d'autres routes et rôles autorisés
    };

    // Si la route n'est pas dans les règles, on l'autorise par défaut
    if (!accessRules[path]) return true;

    return accessRules[path].includes(role);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (token && userData?.role) {
          const newUser = { 
            loggedIn: true,
            role: userData.role 
          };
          setUser(newUser);
          
          // Redirection basée sur le rôle
          if (location.pathname === '/' || !checkAccess(location.pathname, userData.role)) {
            const defaultPaths = {
              'client': '/client/dashboard',
              'admin': '/admin/dashboard',
              'technicien': '/technicien/dashboard'
            };
            
            navigate(defaultPaths[userData.role] || '/', { 
              replace: true,
              state: location.pathname === '/' ? null : { error: "Accès non autorisé" }
            });
          } else {
            setLastAuthorizedPath(location.pathname);
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      }
    };
  
    initializeAuth();
  }, [location.pathname, navigate]);

  const login = (token, userData) => {
    try {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      const newUser = { 
        loggedIn: true,
        role: userData.role 
      };
      setUser(newUser);
      
      // Après connexion, vérifier si l'utilisateur peut accéder à la page demandée
      if (checkAccess(location.pathname, userData.role)) {
        setLastAuthorizedPath(location.pathname);
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate(lastAuthorizedPath || '/', {
          state: { error: "Vous ne pouvez pas accéder à cette page" }
        });
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
      setError(err);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
      setLastAuthorizedPath("/");
      navigate("/");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
      setError(err);
    }
  };

  if (error) {
    return <p>Une erreur est survenue. Veuillez recharger la page.</p>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, checkAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};