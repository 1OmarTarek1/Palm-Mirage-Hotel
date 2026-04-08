import { Link, Outlet } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useScrollToTop from "@/hooks/useScrollToTop";

import AuthImage from "../assets/auth/auth img.jpg";

export default function AuthLayout() {
  useScrollToTop();
  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side Outlet*/}
        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Right Side  */}
        <div className="hidden lg:block relative rounded-xl overflow-hidden h-[90vh] sticky top-[5vh] self-start">
          <img
            src={AuthImage}
            alt="auth"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/5 " />

          <Link
            to="/"
            className="absolute left-6 top-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-black/35"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back To Home</span>
          </Link>

          {/* Text */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-snug">
              Homes as unique as you.
            </h2>
            <p className="text-white/90 text-base md:text-lg">
              Find your perfect space today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
