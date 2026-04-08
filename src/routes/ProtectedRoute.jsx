import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { WishlistPageSkeleton, SettingsPageSkeleton, CheckoutPageSkeleton } from '@/components/common/loading/AppPageSkeletons';
import { ShopCartWithItemsSkeleton } from '@/components/shopcart/loading/ShopCartSkeleton';
import { ProfilePageSkeleton } from '@/components/profile/loading/ProfilePageSkeleton';
import useAuth from '@/hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, isHydrating } = useAuth();
  const location = useLocation();

  if (isHydrating) {
    if (location.pathname === '/wishlist') {
      return <WishlistPageSkeleton />;
    }

    if (location.pathname === '/cart') {
      return <ShopCartWithItemsSkeleton />;
    }

    if (location.pathname === '/cart/checkout') {
      return <CheckoutPageSkeleton />;
    }

    if (location.pathname === '/profile') {
      return <ProfilePageSkeleton />;
    }

    if (location.pathname === '/settings') {
      return <SettingsPageSkeleton />;
    }

    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
