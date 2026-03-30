import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '@/layouts//AuthLayout';
import MainLayout from '@/layouts/MainLayout.jsx';
import NotFound from '@/pages/NotFound/NotFound';

// Public Pages
import About from '@/pages/About/About';
import Blog from '@/pages/Blog/Blog';
import BlogDetails from '@/pages/Blog/BlogDetails';
import Contact from '@/pages/Contact/Contact';
import Home from '@/pages/Home/Home';
import RoomDetails from '@/pages/Rooms/RoomDetails';
import Rooms from '@/pages/Rooms/Rooms';
// import Services from '@/pages/Services/Services';
import Wellness from '@/pages/Services/Wellness';
import Meetings from '@/pages/Services/Meetings';
import Menu from '@/pages/menu/Menu';
import Activities from '@/pages/Activities/Activities';
import ActivityDetailPage from '@/pages/Activities/ActivityDetailPage';
import ShopCart from '@/pages/shopcart/ShopCart';
import Checkout from '@/pages/Checkout/Checkout';
import Profile from '@/pages/Profile/Profile';
import Settings from '@/pages/Settings/Settings';
import Wishlist from '@/pages/Wishlist/Wishlist';

// Auth Pages
import ForgotPassword from '@/pages/Auth/ForgotPassword';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import ResetPassword from '@/pages/Auth/ResetPassword';
import Restaurant from '../pages/Services/Restaurant.jsx';
// import ProtectedRoute from './ProtectedRoute'

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rooms', element: <Rooms /> },
      { path: 'rooms/:id', element: <RoomDetails /> },
      { path: 'services', element: <Wellness /> },
      { path: 'services/wellness', element: <Wellness /> },
      { path: 'services/Meetings', element: <Meetings /> },
      { path: 'services/menu', element: <Menu /> },
      { path: 'services/restaurant', element: <Restaurant /> },
      { path: 'services/relax', element: <Relax /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:id', element: <BlogDetails /> },
      { path: 'services/activities', element: <Activities /> },
      { path: 'services/activities/:id', element: <ActivityDetailPage /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'cart', element: <ShopCart /> },
      { path: 'cart/checkout', element: <Checkout /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'wishlist', element: <Wishlist /> },
    ],
  },

  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },

  // ProtectedRoute for authenticated users (e.g., account management, bookings)
  // {
  //   path: "/account",
  //   element: (
  //     <ProtectedRoute>
  //       <MainLayout />
  //     </ProtectedRoute>
  //   ),
  //   errorElement: <NotFound />,
  //   children: [
  //     { path: "booking/:roomId", element: <Booking /> },
  //     { path: "my-reservations", element: <MyReservations /> },
  //   ],
  // },
]);
