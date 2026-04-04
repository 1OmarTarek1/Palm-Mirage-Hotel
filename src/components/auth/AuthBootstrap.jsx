import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "@/services/axiosInstance";
import { finishHydration, logout, setCredentials } from "@/store/slices/authSlice";

export default function AuthBootstrap() {
  const dispatch = useDispatch();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }
    hasBootstrapped.current = true;

    let isMounted = true;

    const applyAccount = async () => {
      const { data } = await axiosInstance.get("/auth/account");
      if (isMounted) {
        dispatch(setCredentials({ user: data?.data?.user ?? null }));
      }
    };

    const bootstrapAuth = async () => {
      try {
        await applyAccount();
      } catch {
        try {
          await axiosInstance.get("/auth/refresh-token");
          await applyAccount();
        } catch {
          if (isMounted) {
            dispatch(logout());
          }
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
