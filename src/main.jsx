import { StrictMode } from "react";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "./store/store.js";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { queryClient } from "./lib/queryClient.js";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {googleClientId ? (
          <GoogleOAuthProvider clientId={googleClientId}>
            <App />
          </GoogleOAuthProvider>
        ) : (
          <App />
        )}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
