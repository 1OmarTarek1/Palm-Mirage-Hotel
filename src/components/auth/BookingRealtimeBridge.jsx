import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axiosInstance from "@/services/axiosInstance";
import { refreshUserSnapshot } from "@/services/userSnapshot";

const BASE_URL = (
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
    : import.meta.env.VITE_API_BASE_URL
).replace(/\/$/, "");

const SOCKET_SERVER_URL = BASE_URL;

const isUnauthorizedSocketError = (error) =>
  /unauthorized/i.test(error?.message || "");

export default function BookingRealtimeBridge() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
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

    const handlePaymentCheckoutUpdated = () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications", "inbox"] });
      queueSnapshotRefresh();
    };

    const handleBookingUpdated = (payload) => {
      const title = payload?.title || "Booking update";
      const message = payload?.message || "Your bookings were refreshed.";
      const severity = payload?.severity || "info";
      if (severity === "warning") {
        toast.warning(message, { toastId: `booking:${payload?.bookingId}:${payload?.action}` });
      } else if (severity === "success") {
        toast.success(message, { toastId: `booking:${payload?.bookingId}:${payload?.action}` });
      } else {
        toast.info(`${title}: ${message}`, { toastId: `booking:${payload?.bookingId}:${payload?.action}` });
      }
      void queryClient.invalidateQueries({ queryKey: ["notifications", "inbox"] });
      queueSnapshotRefresh();
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

    socket.on("user.booking.updated", handleBookingUpdated);
    socket.on("payment.checkout.updated", handlePaymentCheckoutUpdated);

    socket.on("connect_error", handleConnectError);
    socket.connect();

    return () => {
      isMounted = false;
      socket.off("user.booking.updated", handleBookingUpdated);
      socket.off("payment.checkout.updated", handlePaymentCheckoutUpdated);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [axiosPrivate, dispatch, isAuthenticated, isHydrating, queryClient]);

  return null;
}
