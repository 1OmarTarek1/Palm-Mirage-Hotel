import { Navigate, Outlet, useLocation } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
