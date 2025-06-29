import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserLoginMutation, useGetUserConnetedQuery } from "../API/authApi";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [loginMutation] = useUserLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBarOpen, setSidebarOpen] = useState(false);

  //console.log(sideBarOpen)

  // Utilise RTK Query pour récupérer le user connecté
  const { data: user, isLoading, isError, refetch } = useGetUserConnetedQuery(undefined, {
    skip: !token, // Ne pas fetch si pas de token
  });

  // Redirection basée sur le rôle
  useEffect(() => {
    if (!isLoading && user) {
      const rolePath = {
        client: "/client/dashboard",
        admin: "/admin/dashboard",
        technicien: "/technicien/dashboard",
      };

      if (location.pathname === "/") {
        navigate(rolePath[user.role] || "/");
      }
    }
    if (!isLoading && !user && !location.pathname.includes("/")) {
      navigate("/");
    }
  }, [user, isLoading, location.pathname, navigate]);

  if (isError) {
    console.error("Error fetching user:", isError);
  }

  const login = async (credentials) => {
    try {
      // 1. Appel de l'API de login
      const response = await loginMutation(credentials).unwrap();
      const { token: newToken } = response;
  
      // 2. Stockage du token
      localStorage.setItem("authToken", newToken);
      setToken(newToken);

      // navigate(`/${user.role}/dashboard`);

      // window.location.reload();

      // console.log(response);

      toast.success(
        <span>
          <p>
            Bienvenu(e)
            <strong className='font-bold capitalize'>{" "}{response?.user?.prenom} {response?.user?.nom}</strong>, vous êtes connecté en tant que
            <strong className='font-bold capitalize'>{" "}{response?.user?.role}</strong>
          </p>
        </span>,
        { duration: 5000 }
      );
  
    } catch (err) {
      console.error("Login error:", err?.data?.message);
      throw err?.data?.message;
    }
  };
  
  const logout = () => {
    // 1. Supprimer le token
    localStorage.removeItem("authToken");
    setToken("");
    localStorage.setItem("disconnected", "yes")
    
    // 2. Réinitialiser le cache API
    // dispatch(authApi.util.resetApiState());

    // 4. Optionnel: Rafraîchir la page
    // window.location.reload();
    
    // 3. Rediriger vers la page de login
    // navigate("/", { replace: true });
    
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sideBarOpen);
  };

  if (isLoading) return <div><LoadingSpinner/></div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        sideBarOpen,
        toggleSidebar,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AuthProvider;
