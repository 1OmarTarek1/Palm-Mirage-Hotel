import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Calendar,
  Globe,
  Mail,
  Phone,
  Shield,
  ShoppingCart,
  Ticket,
  User,
  UtensilsCrossed,
} from "lucide-react";
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
import { ProfilePageSkeleton } from "@/components/common/loading/WebsiteSkeletons";

export default function Profile() {
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { user, isAuthenticated, isHydrating } = useSelector((state) => state.auth);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  const cartRequiresAttention = useSelector(selectCartRequiresAttention);
  const roomBookings = useSelector(selectBookings);
  const roomBookingsLoading = useSelector(selectRoomBookingsLoading);
  const roomBookingsError = useSelector(selectRoomBookingsError);
  const activityBookings = useSelector(selectActivityBookings);
  const activityBookingsLoading = useSelector(selectActivityBookingsLoading);
  const activityBookingsError = useSelector(selectActivityBookingsError);
  const tableBookings = useSelector(selectTableBookings);
  const tableBookingsLoading = useSelector(selectTableBookingsLoading);
  const tableBookingsError = useSelector(selectTableBookingsError);
  const [pendingCancelKey, setPendingCancelKey] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileSnapshotLoading, setIsProfileSnapshotLoading] = useState(true);

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

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const infoItems = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: Globe, label: "Country", value: user?.country !== "N/A" ? user?.country : null },
    { icon: Phone, label: "Phone", value: user?.phoneNumber },
    {
      icon: User,
      label: "Gender",
      value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : null,
    },
    {
      icon: Calendar,
      label: "Date of Birth",
      value: user?.DOB ? new Date(user.DOB).toLocaleDateString() : null,
    },
    { icon: Calendar, label: "Member Since", value: memberSince },
    {
      icon: Shield,
      label: "Role",
      value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null,
    },
  ];

  const accountDetails = infoItems.filter((item) => Boolean(item.value));
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
        accountDetails={accountDetails}
        stats={stats}
        snapshotCards={snapshotCards}
        wishlistItems={wishlistItems}
        wishlistCount={wishlistCount}
        cartItems={cartItems}
        cartCount={cartCount}
        cartTotal={cartTotal}
        cartRequiresAttention={cartRequiresAttention}
        roomBookings={roomBookings}
        roomBookingsLoading={roomBookingsLoading}
        roomBookingsError={roomBookingsError}
        activityBookings={activityBookings}
        activityBookingsLoading={activityBookingsLoading}
        activityBookingsError={activityBookingsError}
        tableBookings={tableBookings}
        tableBookingsLoading={tableBookingsLoading}
        tableBookingsError={tableBookingsError}
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
