import { useContext, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const PrivateRoute = ({ role }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/', { 
        replace: true,
        state: { from: location.pathname } 
      });
      return;
    }

    if (role && user.role !== role) {
      const defaultPaths = {
        'client': '/client/dashboard',
        'admin': '/admin/dashboard',
        'technicien': '/technicien/dashboard'
      };
      
      navigate(defaultPaths[user.role] || '/', { 
        replace: true,
        state: { error: "Accès non autorisé" } 
      });
    }
  }, [user, role, navigate, location]);

  if (!user) return null;
  if (role && user.role !== role) return null;

  return <Outlet />;
};

export default PrivateRoute;