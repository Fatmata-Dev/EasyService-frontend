// import { createContext, useContext, useState, useEffect, useCallback } from "react";
// import PropTypes from "prop-types";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// export const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("authToken") || "");
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Mémoïzation de la fonction checkAuth
//   const checkAuth = useCallback(async () => {
//     try {
//       const storedToken = localStorage.getItem("authToken");
//       if (!storedToken) return null;

//       const userData = JSON.parse(localStorage.getItem("user"));
//       if (!userData?._id) return null;

//       const response = await axios.get(
//         `https://easyservice-backend-iv29.onrender.com/api/users/${userData._id}`,
//         { headers: { Authorization: `Bearer ${storedToken}` }}
//       );

//       return response.data;
//     } catch (error) {
//       console.error("Auth verification error:", error);
//       return null;
//     }
//   }, []);

//   // Initialisation de l'authentification
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         const userData = await checkAuth();

//         if (userData) {
//           setUser(userData);
//           setToken(localStorage.getItem("authToken"));

//           // Redirection uniquement si sur la page d'accueil
//           if (location.pathname === "/") {
//             const rolePath = {
//               client: '/client/dashboard',
//               admin: '/admin/dashboard',
//               technicien: '/technicien/dashboard'
//             };
//             navigate(rolePath[userData.role] || '/');
//           }
//         } else {
//           // Si non authentifié et pas déjà sur la page de login
//           if (!location.pathname.includes('/')) {
//             navigate('/');
//           }
//         }
//       } catch (err) {
//         console.error("Auth init error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [checkAuth, navigate, location.pathname]);

//   const login = async (credentials) => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "https://easyservice-backend-iv29.onrender.com/api/auth/login",
//         credentials
//       );

//       const { user: userData, token } = response.data;

//       const normalizedUser = {
//         prenom: userData.prenom || '',
//         nom: userData.nom || '',
//         email: userData.email || '',
//         role: userData.role || 'user',
//         _id: userData._id,
//         ...userData
//       };

//       setUser(normalizedUser);
//       setToken(token);
//       localStorage.setItem("authToken", token);
//       localStorage.setItem("user", JSON.stringify(normalizedUser));

//       const rolePath = {
//         client: '/client/dashboard',
//         admin: '/admin/dashboard',
//         technicien: '/technicien/dashboard'
//       };

//       navigate(rolePath[normalizedUser.role] || '/');
//     } catch (err) {
//       console.error("Login error:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     setUser(null);
//     setToken("");
//     navigate("/");
//   };

//   if (loading) {
//     return <div className="loading-spinner">Chargement...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       token,
//       loading,
//       login,
//       logout,
//       checkAuth
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };
