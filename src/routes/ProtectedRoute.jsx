import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;