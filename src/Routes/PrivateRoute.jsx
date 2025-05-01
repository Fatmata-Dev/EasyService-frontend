import { Navigate } from 'react-router-dom';
import { useGetUserConnetedQuery } from '../API/authApi';

const PrivateRoute = ({ children, role }) => {
  const { data: user, isLoading } = useGetUserConnetedQuery();

  if (isLoading) return null;

  if (!user || user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
