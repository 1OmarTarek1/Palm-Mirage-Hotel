import { Suspense, createElement, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts//AuthLayout";
import MainLayout from "@/layouts/MainLayout.jsx";
import NotFound from "@/pages/NotFound/NotFound";

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

const routeFallback = (
  <div className="flex min-h-[40vh] items-center justify-center px-4 py-12 text-sm text-muted-foreground">
    Loading page...
  </div>
);

const withSuspense = (LazyPage) => (
  <Suspense fallback={routeFallback}>
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
      { path: "contact", element: withSuspense(Contact) },
      { path: "cart", element: withSuspense(ShopCart) },
      { path: "cart/checkout", element: withSuspense(Checkout) },
      { path: "profile", element: withSuspense(Profile) },
      { path: "settings", element: withSuspense(Settings) },
      { path: "wishlist", element: withSuspense(Wishlist) },
    ],
  },

  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <NotFound />,
    children: [
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
      { path: "forgot-password", element: withSuspense(ForgotPassword) },
      { path: "reset-password", element: withSuspense(ResetPassword) },
      { path: "change-password", element: withSuspense(ChangePassword) },
      { path: "confirm-email", element: withSuspense(ConfirmEmail) },
    ],
  },
]);
