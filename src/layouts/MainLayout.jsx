import { Outlet } from "react-router-dom";

import Navbar from "@/components/common/Navbar/Navbar";
import CartSidebar from "@/components/common/CartSidebar";
import MainContainer from "@/components/common/MainContainer";
import Footer from "@/components/common/Footer";

export default function MainLayout() {
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
