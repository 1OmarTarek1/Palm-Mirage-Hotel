import { Suspense, createElement, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts//AuthLayout";
import MainLayout from "@/layouts/MainLayout.jsx";
import NotFound from "@/pages/NotFound/NotFound";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { ContactPageSkeleton } from "@/components/Contact/loading/ContactPageSkeleton";
import { HomeHeroSkeleton } from "@/components/common/loading/WebsiteSkeletons";

const About = lazy(() => import("@/pages/About/About"));
const Blog = lazy(() => import("@/pages/Blog/Blog"));
const BlogDetails = lazy(() => import("@/pages/Blog/BlogDetails"));
const Contact = lazy(() => import("@/pages/Contact/Contact"));
const Home = lazy(() => import("@/pages/Home/Home"));
const RoomDetails = lazy(() => import("@/pages/Rooms/RoomDetails"));
const Rooms = lazy(() => import("@/pages/Rooms/Rooms"));
const Wellness = lazy(() => import("@/pages/Services/Wellness"));
const Meetings = lazy(() => import("@/pages/Services/Meetings"));
const Menu = lazy(() => import("@/pages/menu/Menu"));
const Activities = lazy(() => import("@/pages/Activities/Activities"));
const ActivityDetailPage = lazy(() => import("@/pages/Activities/ActivityDetailPage"));
const ShopCart = lazy(() => import("@/pages/shopcart/ShopCart"));
const Checkout = lazy(() => import("@/pages/Checkout/Checkout"));
const Profile = lazy(() => import("@/pages/Profile/Profile"));
const Settings = lazy(() => import("@/pages/Settings/Settings"));
const Wishlist = lazy(() => import("@/pages/Wishlist/Wishlist"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Register = lazy(() => import("@/pages/Auth/Register"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword"));
const ChangePassword = lazy(() => import("@/pages/Auth/ChangePassword"));
const Restaurant = lazy(() => import("@/pages/Services/Restaurant.jsx"));
const ConfirmEmail = lazy(() => import("@/pages/Auth/ConfirmEmail.jsx"));

const routeFallback = <HomeHeroSkeleton />;
const authFallback = (
  <div className="w-full max-w-md space-y-4">
    <div className="h-8 w-40 animate-pulse rounded-lg bg-muted/50" />
    <div className="h-4 w-64 animate-pulse rounded bg-muted/50" />
    <div className="h-11 w-full animate-pulse rounded-xl bg-muted/50" />
    <div className="h-11 w-full animate-pulse rounded-xl bg-muted/50" />
    <div className="h-11 w-full animate-pulse rounded-xl bg-muted/50" />
  </div>
);

const withSuspense = (LazyPage, fallback = routeFallback) => (
  <Suspense fallback={fallback}>
    {createElement(LazyPage)}
  </Suspense>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "rooms", element: withSuspense(Rooms) },
      { path: "rooms/:id", element: withSuspense(RoomDetails) },
      { path: "services", element: withSuspense(Wellness) },
      { path: "services/wellness", element: withSuspense(Wellness) },
      { path: "services/Meetings", element: withSuspense(Meetings) },
      { path: "services/menu", element: withSuspense(Menu) },
      { path: "services/restaurant", element: withSuspense(Restaurant) },
      { path: "blog", element: withSuspense(Blog) },
      { path: "blog/:id", element: withSuspense(BlogDetails) },
      { path: "services/activities", element: withSuspense(Activities) },
      { path: "services/activities/:id", element: withSuspense(ActivityDetailPage) },
      { path: "about", element: withSuspense(About) },
      { path: "contact", element: withSuspense(Contact, <ContactPageSkeleton />) },
      { path: "profile", element: withSuspense(Profile) },
      { path: "settings", element: withSuspense(Settings) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: withSuspense(ShopCart) },
          { path: "cart/checkout", element: withSuspense(Checkout) },
          { path: "wishlist", element: withSuspense(Wishlist) },
        ],
      },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "login", element: withSuspense(Login, authFallback) },
      { path: "register", element: withSuspense(Register, authFallback) },
      { path: "forgot-password", element: withSuspense(ForgotPassword, authFallback) },
      { path: "reset-password", element: withSuspense(ResetPassword, authFallback) },
      { path: "change-password", element: withSuspense(ChangePassword, authFallback) },
      { path: "confirm-email", element: withSuspense(ConfirmEmail, authFallback) },
    ],
  },
]);
