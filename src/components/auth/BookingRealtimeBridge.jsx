import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import axiosInstance from "@/services/axiosInstance";
import { refreshUserSnapshot } from "@/services/userSnapshot";

const getSocketUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (url) return url.trim().replace(/\/$/, "");

  // Fallback only in development mode
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }

  // Explicitly fail in production if the variable is missing
  throw new Error(
    "[BookingRealtimeBridge] VITE_API_BASE_URL is not configured in production settings."
  );
};

const BASE_URL = getSocketUrl();

const SOCKET_SERVER_URL = BASE_URL;
let sharedSocket = null;
let sharedSocketAuthKey = null;
let sharedSocketConsumers = 0;

const isUnauthorizedSocketError = (error) =>
  /unauthorized/i.test(error?.message || "");

const getSocketAuthPayload = () => {
  const accessToken =
    typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    token: accessToken,
    authScheme: "Bearer",
    scheme: "Bearer",
  };
};

export default function BookingRealtimeBridge() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const { isAuthenticated, isHydrating } = useSelector((state) => state.auth);
  const refreshTimeoutRef = useRef(null);
  const refreshingSocketAuthRef = useRef(false);
  const seenEventKeysRef = useRef(new Set());

  useEffect(() => {
    if (isHydrating || !isAuthenticated) {
      return;
    }

    let isMounted = true;
    const socketAuth = getSocketAuthPayload();

    if (!socketAuth?.accessToken) {
      return;
    }

    const socketAuthKey = socketAuth.accessToken;
    if (!sharedSocket || sharedSocketAuthKey !== socketAuthKey) {
      if (sharedSocket) {
        sharedSocket.removeAllListeners();
        sharedSocket.disconnect();
      }

      sharedSocket = io(SOCKET_SERVER_URL, {
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: false,
        auth: socketAuth,
      });
      sharedSocketAuthKey = socketAuthKey;
    } else {
      sharedSocket.auth = socketAuth;
    }

    sharedSocketConsumers += 1;
    const socket = sharedSocket;

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

    const markEventAsSeen = (key) => {
      if (!key) return false;
      if (seenEventKeysRef.current.has(key)) return true;
      seenEventKeysRef.current.add(key);
      if (seenEventKeysRef.current.size > 200) {
        const iterator = seenEventKeysRef.current.values();
        const first = iterator.next().value;
        if (first) seenEventKeysRef.current.delete(first);
      }
      return false;
    };

    const toastNewNotification = ({ title, message, severity = "info", toastId }) => {
      const body = title ? `${title}: ${message}` : message;
      if (severity === "warning") {
        toast.warning(body, { toastId });
        return;
      }
      if (severity === "success") {
        toast.success(body, { toastId });
        return;
      }
      toast.info(body, { toastId });
    };

    const handlePaymentCheckoutUpdated = (payload) => {
      const eventKey = `payment:${payload?.checkoutId || payload?.sessionId || "unknown"}:${payload?.status || "updated"}:${payload?.paymentStatus || "unknown"}`;
      if (!markEventAsSeen(eventKey)) {
        const paymentKind = payload?.kind || "checkout";
        const status = payload?.status || "updated";
        const paymentStatus = payload?.paymentStatus || "updated";
        const severity =
          paymentStatus === "paid" || status === "fulfilled"
            ? "success"
            : status === "expired" || status === "failed"
              ? "warning"
              : "info";
        toastNewNotification({
          title: "New notification",
          message: `${paymentKind} payment is now ${status}${paymentStatus ? ` (${paymentStatus})` : ""}.`,
          severity,
          toastId: eventKey,
        });
      }
      void queryClient.invalidateQueries({ queryKey: ["notifications", "inbox"] });
      queueSnapshotRefresh();
    };

    const handleBookingUpdated = (payload) => {
      const eventKey = `booking:${payload?.resource || "booking"}:${payload?.bookingId || payload?.bookingIds?.join(",") || "unknown"}:${payload?.action || "updated"}:${payload?.occurredAt || ""}`;
      if (!markEventAsSeen(eventKey)) {
        const title = payload?.title || "New notification";
        const message = payload?.message || "Your bookings were refreshed.";
        const severity = payload?.severity || "info";
        toastNewNotification({
          title: "New notification",
          message: title === "New notification" ? message : `${title}: ${message}`,
          severity,
          toastId: eventKey,
        });
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

      // Refresh-token flow is disabled on the Website. Let the user re-login if needed.
      refreshingSocketAuthRef.current = true;
      if (isMounted) {
        console.warn("Realtime socket unauthorized; refresh is disabled. Please login again.");
      }
      refreshingSocketAuthRef.current = false;
    };

    socket.on("user.booking.updated", handleBookingUpdated);
    socket.on("payment.checkout.updated", handlePaymentCheckoutUpdated);

    socket.on("connect_error", handleConnectError);
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      isMounted = false;
      socket.off("user.booking.updated", handleBookingUpdated);
      socket.off("payment.checkout.updated", handlePaymentCheckoutUpdated);
      socket.off("connect_error", handleConnectError);

      sharedSocketConsumers = Math.max(0, sharedSocketConsumers - 1);
      if (sharedSocketConsumers === 0 && socket.connected) {
        socket.disconnect();
      }

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [axiosPrivate, dispatch, isAuthenticated, isHydrating, queryClient]);

  return null;
}
