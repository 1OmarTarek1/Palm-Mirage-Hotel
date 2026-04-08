import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import { finishHydration, logout, setCredentials } from "@/store/slices/authSlice";
import { refreshUserSnapshot } from "@/services/userSnapshot";
import axiosInstance from "@/services/axiosInstance";

export default function AuthBootstrap() {
  const dispatch = useDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }
    hasBootstrapped.current = true;

    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        // LocalStorage-first: do NOT call any bootstrap endpoints here.
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (accessToken && user) {
          dispatch(
            setCredentials({
              user,
              token: accessToken,
              refreshToken,
              skipCollectionsSync: true,
            }),
          );

          // Force a fresh fetch from the server on boot to hydrate the cart/wishlist correctly
          // We use a temporary axios instance with the token we just retrieved
          try {
            const bootstrapAxios = async (config) => {
              config.headers.Authorization = `Bearer ${accessToken}`;
              return axiosInstance(config);
            };
            bootstrapAxios.get = (url) =>
              axiosInstance.get(url, { headers: { Authorization: `Bearer ${accessToken}` } });

            await refreshUserSnapshot({ dispatch, axiosPrivate: bootstrapAxios });
          } catch (e) {
            console.warn("Bootstrap snapshot refresh failed (using local data):", e);
          }
        } else {
          dispatch(finishHydration());
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to bootstrap the authenticated user snapshot:", error);
          // Keep auth state and storage in sync: if bootstrap fails,
          // clear stale local session instead of leaving ghost tokens.
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          dispatch(logout());
        }
      } finally {
        if (isMounted) {
          dispatch(finishHydration());
        }
      }
    };

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}
