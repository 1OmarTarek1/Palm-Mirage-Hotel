import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";

import AuthBootstrap from "./components/auth/AuthBootstrap";
import { routes } from "./routes/AppRoutes";
import FlyToCartOverlay from "./components/common/FlyToCartOverlay";

export default function App() {
  return (
    <>
      <AuthBootstrap />
      <ToastContainer
        position="top-left"
        autoClose={3000}
        limit={5}
        newestOnTop={true}
        className="mt-17!"
        toastClassName="!bg-card !text-foreground !font-main !rounded-xl !border !border-border !shadow-lg !shadow-black/5 !overflow-hidden !px-4 !pr-6 !py-4"
        toastStyle={{ fontSize: "0.8rem" }}
      />
      <RouterProvider router={routes} />
      <FlyToCartOverlay />
    </>
  );
}
