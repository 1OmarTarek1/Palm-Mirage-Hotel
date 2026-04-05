import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axiosInstance from "@/services/axiosInstance";
import { refreshUserSnapshot } from "@/services/userSnapshot";

const SOCKET_SERVER_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const BOOKING_REALTIME_EVENTS = [
  "user.booking.updated",
  "payment.checkout.updated",
];

const isUnauthorizedSocketError = (error) =>
  /unauthorized/i.test(error?.message || "");

export default function BookingRealtimeBridge() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { isAuthenticated, isHydrating } = useSelector((state) => state.auth);
  const refreshTimeoutRef = useRef(null);
  const refreshingSocketAuthRef = useRef(false);

  useEffect(() => {
    if (isHydrating || !isAuthenticated) {
      return;
    }

    let isMounted = true;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false,
    });

    const queueSnapshotRefresh = () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      refreshTimeoutRef.current = window.setTimeout(() => {
        void refreshUserSnapshot({ dispatch, axiosPrivate }).catch((error) => {
          if (isMounted) {
            console.error("Failed to refresh the user snapshot after a realtime booking event:", error);
          }
        });
      }, 250);
    };

    const handleConnectError = async (error) => {
      if (
        !isMounted ||
        refreshingSocketAuthRef.current ||
        !isUnauthorizedSocketError(error)
      ) {
        return;
      }

      refreshingSocketAuthRef.current = true;

      try {
        await axiosInstance.get("/auth/refresh-token");
        if (isMounted && !socket.connected) {
          socket.connect();
        }
      } catch (refreshError) {
        if (isMounted) {
          console.error("Failed to refresh socket authentication for realtime booking updates:", refreshError);
        }
      } finally {
        refreshingSocketAuthRef.current = false;
      }
    };

    BOOKING_REALTIME_EVENTS.forEach((eventName) => {
      socket.on(eventName, queueSnapshotRefresh);
    });

    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      isMounted = false;
      BOOKING_REALTIME_EVENTS.forEach((eventName) => {
        socket.off(eventName, queueSnapshotRefresh);
      });
      socket.off("connect_error", handleConnectError);
      socket.disconnect();

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [axiosPrivate, dispatch, isAuthenticated, isHydrating]);

  return null;
}
