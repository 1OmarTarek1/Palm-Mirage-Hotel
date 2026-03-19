import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";

import { routes } from "./routes/AppRoutes";
import { FlyToCartProvider } from "./context/FlyToCartContext";

export default function App() {
  return (
    <FlyToCartProvider>
      <ToastContainer
        position="bottom-right"
        toastClassName="!bg-card !text-foreground !font-main !rounded-xl !border !border-border !shadow-lg !shadow-black/5 !overflow-hidden !px-4 !pr-6 !py-4"
        toastStyle={{ fontSize: "0.8rem" }}
      />
      <RouterProvider router={routes} />
    </FlyToCartProvider>
  );
}
