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
        // Check if we have tokens in localStorage
        const hasTokens = localStorage.getItem('accessToken') && localStorage.getItem('user');
        
        if (!hasTokens) {
          // No tokens found, finish hydration without trying to refresh
          dispatch(finishHydration());
          return;
        }

        await refreshUserSnapshot({ dispatch, axiosPrivate });
      } catch (error) {
        if (isMounted) {
          console.error("Failed to bootstrap the authenticated user snapshot:", error);
          // Don't logout on bootstrap failure, just finish hydration
          // Let the user stay logged in if tokens exist
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
