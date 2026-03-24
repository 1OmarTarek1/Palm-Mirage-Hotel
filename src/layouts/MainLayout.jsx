import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import Navbar from "@/components/common/Navbar/Navbar";
import CartSidebar from "@/components/common/CartSidebar";
import MainContainer from "@/components/common/MainContainer";
import Footer from "@/components/common/Footer";
import useScrollToTop from "@/hooks/useScrollToTop";
import { fetchUserProfile } from "@/store/slices/authSlice";

export default function MainLayout() {
  useScrollToTop();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!isAuthenticated && !loading && Cookies.get("accessToken")) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, loading, dispatch]);
  return (
    <div className="relative min-h-screen bg-secondary/3">
      {/* Global Decorative Background Elements */}
      <div className="fixed top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      
      <Navbar />
      <CartSidebar />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <Footer />
    </div>
  );
}
