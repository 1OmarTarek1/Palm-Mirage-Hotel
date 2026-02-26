import { Outlet } from "react-router-dom";

import Navbar from "@/components/common/Navbar/Navbar";
import CartSidebar from "@/components/common/CartSidebar";
import MainContainer from "@/components/common/MainContainer";
import Footer from "@/components/common/Footer";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function MainLayout() {
  useScrollToTop();
  return (
    <>
      <Navbar />
      <CartSidebar />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <Footer />
    </>
  );
}
