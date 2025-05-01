import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserLoginMutation, useGetUserConnetedQuery } from "../API/authApi";
import { AuthContext } from "./authContext";


const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [loginMutation] = useUserLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await loginMutation(credentials).unwrap();
      const { token: newToken } = response;

      localStorage.setItem("authToken", newToken);
      setToken(newToken);
      refetch(); // force une actualisation du user connecté

    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken("");
    navigate("/");
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
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
