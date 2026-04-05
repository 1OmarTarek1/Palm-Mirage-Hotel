import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  addRestaurantMenuToCart,
  closeCart,
  openCart,
  resetRestaurantMenuCart,
  selectRestaurantMenuCart,
  setRestaurantMenuCartQty,
} from "@/store/slices/cartSlice";

const RestaurantCartContext = createContext(null);

const RESTAURANT_BOOKING_PATH = "/services/restaurant";
const RESTAURANT_BOOKING_HASH = "#table-booking";

export function RestaurantCartProvider({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectRestaurantMenuCart);
  const isAuthenticated = useSelector((s) => s.auth?.isAuthenticated);
  const isHydrating = useSelector((s) => s.auth?.isHydrating);
  const [bookingPrefill, setBookingPrefill] = useState(null);

  const addToCart = useCallback(
    (itemId, options = {}) => {
      if (isHydrating) {
        toast.info("Loading your session...");
        return false;
      }
      if (!isAuthenticated) {
        toast.info("Please sign in to add dishes to your cart.");
        return false;
      }
      const id = String(itemId);
      if (!id) return false;
      const delta = typeof options.delta === "number" ? options.delta : 1;
      dispatch(addRestaurantMenuToCart({ itemId: id, delta }));
      if (options.openDrawer === true) dispatch(openCart({ tab: "restaurant" }));
      return true;
    },
    [dispatch, isAuthenticated, isHydrating],
  );

  const setQty = useCallback(
    (id, qty) => {
      if (!isAuthenticated) {
        toast.info("Please sign in to manage your restaurant cart.");
        return;
      }
      dispatch(setRestaurantMenuCartQty({ id, qty }));
    },
    [dispatch, isAuthenticated],
  );

  const resetCart = useCallback(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to manage your restaurant cart.");
      return;
    }
    dispatch(resetRestaurantMenuCart());
  }, [dispatch, isAuthenticated]);

  const clearBookingPrefill = useCallback(() => setBookingPrefill(null), []);

  const goToBookingWithOrder = useCallback(() => {
    if (!isAuthenticated) {
      toast.info("Please sign in to complete a restaurant booking.");
      return;
    }
    setBookingPrefill({ mode: "dine_in" });
    dispatch(closeCart());

    navigate(`${RESTAURANT_BOOKING_PATH}${RESTAURANT_BOOKING_HASH}`);

    const scrollToBooking = () => {
      const el = document.getElementById("table-booking");
      if (!el) return;
      const reduceMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      try {
        el.querySelector?.("#date")?.focus?.({ preventScroll: true });
      } catch {
        /* ignore */
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToBooking);
    });
    window.setTimeout(scrollToBooking, 450);
  }, [dispatch, isAuthenticated, navigate]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      setQty,
      resetCart,
      bookingPrefill,
      clearBookingPrefill,
      goToBookingWithOrder,
    }),
    [cart, addToCart, setQty, resetCart, bookingPrefill, clearBookingPrefill, goToBookingWithOrder],
  );

  return <RestaurantCartContext.Provider value={value}>{children}</RestaurantCartContext.Provider>;
}

export function useRestaurantCart() {
  const ctx = useContext(RestaurantCartContext);
  if (!ctx) {
    throw new Error("useRestaurantCart must be used within RestaurantCartProvider");
  }
  return ctx;
}
