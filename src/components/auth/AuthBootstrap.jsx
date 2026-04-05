import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { refreshUserSnapshot } from "@/services/userSnapshot";
import { finishHydration } from "@/store/slices/authSlice";

export default function AuthBootstrap() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) {
      return;
    }
    hasBootstrapped.current = true;

    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        await refreshUserSnapshot({ dispatch, axiosPrivate });
      } catch (error) {
        if (isMounted) {
          console.error("Failed to bootstrap the authenticated user snapshot:", error);
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
  }, [axiosPrivate, dispatch]);

  return null;
}
