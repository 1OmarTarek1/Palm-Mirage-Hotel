import { Outlet } from "react-router-dom";

import CartSidebar from "@/components/common/CartSidebar";
import Footer from "@/components/common/Footer";
import MainContainer from "@/components/common/MainContainer";
import Navbar from "@/components/common/Navbar/Navbar";
import { RestaurantCartProvider } from "@/context/RestaurantCartContext";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function MainLayout() {
  useScrollToTop();
  return (
    <RestaurantCartProvider>
      <div className="relative min-h-screen bg-secondary/3">
        {/* Global Decorative Background Elements */}
        <div className="pointer-events-none fixed top-0 right-0 z-[-1] h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="pointer-events-none fixed bottom-0 left-0 z-[-1] h-[600px] w-[600px] -translate-x-1/3 translate-y-1/3 rounded-full bg-secondary/10 blur-[120px]" />

        <Navbar />
        <CartSidebar />
        <MainContainer>
          <Outlet />
        </MainContainer>
        <Footer />
      </div>
    </RestaurantCartProvider>
  );
}
