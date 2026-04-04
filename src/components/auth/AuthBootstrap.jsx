import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import axiosInstance from "@/services/axiosInstance";
import { finishHydration, logout, setCredentials } from "@/store/slices/authSlice";

const isAuthFailure = (error) => {
  const status = error?.response?.status;
  return status === 400 || status === 401 || status === 403;
};

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

      const user = data?.data?.user ?? null;
      if (isMounted) {
        if (user) {
          dispatch(setCredentials({ user }));
        } else {
          dispatch(logout());
        }
      }

      return user;
    };

    const bootstrapAuth = async () => {
      try {
        await applyAccount();
      } catch (accountError) {
        try {
          await axiosInstance.get("/auth/refresh-token");
          await applyAccount();
        } catch (refreshError) {
          if (isMounted && isAuthFailure(accountError) && isAuthFailure(refreshError)) {
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
