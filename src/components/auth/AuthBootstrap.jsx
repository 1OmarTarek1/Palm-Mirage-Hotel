import { useEffect } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "@/services/axiosInstance";
import { finishHydration, logout, setCredentials } from "@/store/slices/authSlice";

export default function AuthBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/account");
        if (isMounted) {
          dispatch(setCredentials({ user: data?.data?.user ?? null }));
        }
      } catch {
        if (isMounted) {
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
