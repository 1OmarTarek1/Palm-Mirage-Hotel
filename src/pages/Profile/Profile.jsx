import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { Calendar, ShoppingCart, Ticket, UtensilsCrossed } from "lucide-react";
import { toast } from "react-toastify";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
  cancelActivityBooking,
  selectActivityBookings,
  selectActivityBookingsError,
  selectActivityBookingsLoading,
} from "@/services/activityBookings/activityBookingsSlice";
import {
  cancelBooking,
  selectBookings,
  selectListError as selectRoomBookingsError,
  selectListLoading as selectRoomBookingsLoading,
} from "@/services/booking/bookingSlice";
import {
  cancelTableBooking,
  selectTableBookings,
  selectTableBookingsError,
  selectTableBookingsLoading,
} from "@/services/restaurantBookings/restaurantBookingsSlice";
import {
  selectCartCount,
  selectCartItems,
  selectCartRequiresAttention,
  selectCartTotal,
  selectRestaurantMenuCart,
  selectRestaurantMenuCartTotalQty,
  selectPendingRestaurantBookings,
  selectPendingActivityBookings,
} from "@/store/slices/cartSlice";
import {
  selectWishlistCount,
  selectWishlistItems,
} from "@/store/slices/wishlistSlice";
import { setCredentials } from "@/store/slices/authSlice";
import { refreshUserSnapshot } from "@/services/userSnapshot";
import {
  buildProfileStats,
  formatCurrency,
  isActivityBookingCancellable,
  isRoomBookingCancellable,
  isTableBookingCancellable,
} from "@/components/profile/profileUtils";
import ProfileHero from "@/components/profile/ProfileHero";
import ProfileContentSections from "@/components/profile/ProfileContentSections";
import {
  AccountDetailsModal,
  EditProfileModal,
} from "@/components/profile/ProfileAccountModals";
import { ProfilePageSkeleton } from "@/components/profile/loading/ProfilePageSkeleton";

export default function Profile() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const { user, isAuthenticated, isHydrating } = useSelector((state) => state.auth);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  const cartRequiresAttention = useSelector(selectCartRequiresAttention);
  const restaurantMenuTotalQty = useSelector(selectRestaurantMenuCartTotalQty);
  const restaurantMenuCart = useSelector(selectRestaurantMenuCart);
  const roomBookings = useSelector(selectBookings);
  const roomBookingsLoading = useSelector(selectRoomBookingsLoading);
  const roomBookingsError = useSelector(selectRoomBookingsError);
  const activityBookings = useSelector(selectActivityBookings);
  const activityBookingsLoading = useSelector(selectActivityBookingsLoading);
  const activityBookingsError = useSelector(selectActivityBookingsError);
  const tableBookings = useSelector(selectTableBookings);
  const tableBookingsLoading = useSelector(selectTableBookingsLoading);
   const tableBookingsError = useSelector(selectTableBookingsError);
  const pendingRestaurantBookings = useSelector(selectPendingRestaurantBookings);
  const pendingActivityBookings = useSelector(selectPendingActivityBookings);
  const [pendingCancelKey, setPendingCancelKey] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileSnapshotLoading, setIsProfileSnapshotLoading] = useState(true);
  const [highlightedSectionId, setHighlightedSectionId] = useState("");
  const hasScrolledToRecentBooking = useRef(false);
  const pendingPaymentSyncRef = useRef(false);

  const PENDING_PAYMENT_SYNC_KEY = "pendingPaymentSync";

  // Auto-scroll to recent booking functionality
  useEffect(() => {
    const hasHashTarget = Boolean(location.hash?.trim());
    if (hasHashTarget) return;
    if (!isAuthenticated || isProfileSnapshotLoading || hasScrolledToRecentBooking.current) return;

    // Check if user has any recent bookings (created in the last 5 minutes)
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const recentRoomBookings = roomBookings.filter(booking => 
      new Date(booking.createdAt || booking.bookedAt) > fiveMinutesAgo
    );
    const recentActivityBookings = activityBookings.filter(booking => 
      new Date(booking.createdAt) > fiveMinutesAgo
    );
    const recentTableBookings = tableBookings.filter(booking => 
      new Date(booking.createdAt) > fiveMinutesAgo
    );

    const hasRecentBookings = recentRoomBookings.length > 0 || 
                           recentActivityBookings.length > 0 || 
                           recentTableBookings.length > 0;

    if (hasRecentBookings) {
      // Wait a bit for the page to render, then scroll
      const timer = setTimeout(() => {
        // Try to find booking sections in order of priority
        const selectors = [
          '#room-bookings-section',
          '#activity-bookings-section', 
          '#table-bookings-section'
        ];
        
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
            hasScrolledToRecentBooking.current = true;
            break;
          }
        }
      }, 500); // Small delay to ensure content is rendered

      return () => clearTimeout(timer);
    }
  }, [
    location.hash,
    isAuthenticated, 
    isProfileSnapshotLoading, 
    roomBookings, 
    activityBookings, 
    tableBookings
  ]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    setIsProfileSnapshotLoading(true);

    const refreshProfileSnapshot = async () => {
      try {
        await refreshUserSnapshot({ dispatch, axiosPrivate });
      } catch (error) {
        if (isMounted) {
          console.error("Failed to refresh the user snapshot on profile open:", error);
        }
      } finally {
        if (isMounted) {
          setIsProfileSnapshotLoading(false);
        }
      }
    };

    void refreshProfileSnapshot();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || pendingPaymentSyncRef.current) return;
    const raw = window.sessionStorage.getItem(PENDING_PAYMENT_SYNC_KEY);
    const pending = raw ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : null;
    const sessionId = pending?.sessionId;
    const createdAt = Number(pending?.createdAt || 0);
    if (!sessionId) return;
    // Don't keep retrying forever.
    if (createdAt && Date.now() - createdAt > 10 * 60 * 1000) {
      window.sessionStorage.removeItem(PENDING_PAYMENT_SYNC_KEY);
      return;
    }

    pendingPaymentSyncRef.current = true;
    let cancelled = false;

    const poll = async () => {
      try {
        const maxAttempts = 30; // ~60s
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          if (cancelled) return;
          const res = await axiosPrivate.get(`/payment/checkout-session/${encodeURIComponent(sessionId)}`);
          const status = res?.data?.data?.status;
          if (status === "fulfilled") {
            window.sessionStorage.removeItem(PENDING_PAYMENT_SYNC_KEY);
            await refreshUserSnapshot({ dispatch, axiosPrivate });
            toast.success("Reservation synced. Your booking should be visible now.");
            return;
          }
          if (status === "failed" || status === "expired" || status === "cancelled") {
            window.sessionStorage.removeItem(PENDING_PAYMENT_SYNC_KEY);
            toast.error("Payment sync failed. Contact support if you were charged.");
            return;
          }
          await new Promise((r) => setTimeout(r, 2000));
        }
      } catch (e) {
        // Silent: this is best-effort.
      } finally {
        pendingPaymentSyncRef.current = false;
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [axiosPrivate, dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || isHydrating || isProfileSnapshotLoading) return;

    const targetId = location.hash?.replace("#", "").trim();
    if (!targetId) return;

    hasScrolledToRecentBooking.current = true;

    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    const timer = window.setTimeout(() => {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setHighlightedSectionId(targetId);
    }, 120);

    const clearTimer = window.setTimeout(() => {
      setHighlightedSectionId((current) => (current === targetId ? "" : current));
    }, 2200);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearTimer);
    };
  }, [isAuthenticated, isHydrating, isProfileSnapshotLoading, location.hash]);

  const activeRoomBookingsCount = useMemo(
    () => roomBookings.filter(isRoomBookingCancellable).length,
    [roomBookings],
  );
  const activeActivityBookingsCount = useMemo(
    () => activityBookings.filter(isActivityBookingCancellable).length,
    [activityBookings],
  );
  const activeTableBookingsCount = useMemo(
    () => tableBookings.filter(isTableBookingCancellable).length,
    [tableBookings],
  );

  const stats = buildProfileStats({
    wishlistCount,
    cartCount,
    cartRequiresAttention,
    restaurantMenuTotalQty,
    activeRoomBookingsCount,
    activeActivityBookingsCount,
    activeTableBookingsCount,
  });

  const snapshotCards = [
    {
      icon: ShoppingCart,
      label: "Cart Value",
      value: formatCurrency(cartTotal),
      subtitle: cartRequiresAttention
        ? "Some cart items need review before checkout."
        : restaurantMenuTotalQty > 0
          ? "Room total shown here; restaurant dishes live in the same cart (nav icon → Restaurant tab)."
          : "Your current ready-to-checkout total.",
    },
    {
      icon: UtensilsCrossed,
      label: "Dining Plans",
      value: tableBookings.length,
      subtitle: "Restaurant reservations and waitlist requests.",
    },
    {
      icon: Ticket,
      label: "Activity Bookings",
      value: activityBookings.length,
      subtitle: "Experiences currently attached to your account.",
    },
    {
      icon: Calendar,
      label: "Total Room Bookings",
      value: roomBookings.length,
      subtitle: "Every stay on your account, including past and completed visits.",
    },
  ];

  const runCancelAction = async ({ key, action, successMessage, fallbackMessage }) => {
    setPendingCancelKey(key);
    try {
      await dispatch(action).unwrap();
      toast.success(successMessage);
    } catch (error) {
      toast.error(typeof error === "string" ? error : error?.message || fallbackMessage);
    } finally {
      setPendingCancelKey("");
    }
  };

  if (isHydrating) return <ProfilePageSkeleton />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (isProfileSnapshotLoading) return <ProfilePageSkeleton />;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <ProfileHero
        user={user}
        onOpenDetails={() => setIsDetailsModalOpen(true)}
        onOpenEdit={() => setIsEditModalOpen(true)}
      />
      <ProfileContentSections
        highlightedSectionId={highlightedSectionId}
        stats={stats}
        snapshotCards={snapshotCards}
        wishlistItems={wishlistItems}
        wishlistCount={wishlistCount}
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartRequiresAttention={cartRequiresAttention}
        restaurantMenuTotalQty={restaurantMenuTotalQty}
        restaurantMenuCart={restaurantMenuCart}
        roomBookings={roomBookings}
        roomBookingsLoading={roomBookingsLoading}
        roomBookingsError={roomBookingsError}
        activityBookings={activityBookings}
        activityBookingsLoading={activityBookingsLoading}
        activityBookingsError={activityBookingsError}
        tableBookings={tableBookings}
        tableBookingsLoading={tableBookingsLoading}
        tableBookingsError={tableBookingsError}
        pendingRestaurantBookings={pendingRestaurantBookings}
        pendingActivityBookings={pendingActivityBookings}
        pendingCancelKey={pendingCancelKey}
        axiosPrivate={axiosPrivate}
        cancelBooking={cancelBooking}
        cancelActivityBooking={cancelActivityBooking}
        cancelTableBooking={cancelTableBooking}
        runCancelAction={runCancelAction}
      />
      <AccountDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={user}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        axiosPrivate={axiosPrivate}
        onProfileUpdated={(updatedUser) =>
          dispatch(setCredentials({ user: updatedUser, skipCollectionsSync: true }))
        }
      />
    </section>
  );
}
