import axios from "axios";
import axiosInstance from "@/services/axiosInstance";
import {
  fetchMyActivityBookings,
} from "@/services/activityBookings/activityBookingsSlice";
import { fetchMyBookings } from "@/services/booking/bookingSlice";
import {
  fetchMyTableBookings,
} from "@/services/restaurantBookings/restaurantBookingsSlice";
import { fetchUserPreferences } from "@/services/userPreferencesApi";
import { hydrateCart, hydrateRestaurantMenuCart } from "@/store/slices/cartSlice";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { hydrateWishlist } from "@/store/slices/wishlistSlice";

const isAuthFailure = (error) => {
  const status = error?.response?.status;
  return status === 400 || status === 401 || status === 403;
};

const buildSnapshotRequests = ({ dispatch, axiosPrivate }) => [
  {
    key: "account",
    label: "authenticated account",
    run: () => axiosPrivate.get("/auth/account"),
  },
  {
    key: "preferences",
    label: "user preferences",
    run: () => fetchUserPreferences(),
  },
  {
    key: "roomBookings",
    label: "room bookings",
    run: () => dispatch(fetchMyBookings({ axiosPrivate })).unwrap(),
  },
  {
    key: "activityBookings",
    label: "activity bookings",
    run: () => dispatch(fetchMyActivityBookings(axiosPrivate)).unwrap(),
  },
  {
    key: "tableBookings",
    label: "restaurant bookings",
    run: () => dispatch(fetchMyTableBookings(axiosPrivate)).unwrap(),
  },
];

const runSnapshotRequests = async ({ dispatch, axiosPrivate }) => {
  const requests = buildSnapshotRequests({ dispatch, axiosPrivate });
  const results = await Promise.allSettled(requests.map(({ run }) => run()));

  return requests.map((request, index) => ({
    ...request,
    result: results[index],
  }));
};

const hasAuthFailure = (entries = []) =>
  entries.some(
    ({ result }) => result.status === "rejected" && isAuthFailure(result.reason),
  );

const getSnapshotEntry = (entries = [], key) =>
  entries.find((entry) => entry.key === key);

export const applyUserSnapshot = ({ dispatch, user, entries = [] }) => {
  const preferencesEntry = getSnapshotEntry(entries, "preferences");

  if (preferencesEntry?.result.status === "fulfilled") {
    const preferences = preferencesEntry.result.value ?? {};
    dispatch(hydrateCart(preferences.cartItems ?? []));
    dispatch(hydrateWishlist(preferences.wishlistItems ?? []));
    dispatch(hydrateRestaurantMenuCart(preferences.restaurantCart ?? {}));
  } else if (preferencesEntry?.result.status === "rejected") {
    console.error(
      "Failed to refresh user preferences during snapshot sync:",
      preferencesEntry.result.reason,
    );
  }

  entries.forEach(({ key, label, result }) => {
    if (
      key !== "account" &&
      key !== "preferences" &&
      result.status === "rejected"
    ) {
      console.error(`Failed to refresh ${label} during snapshot sync:`, result.reason);
    }
  });

  dispatch(setCredentials({ user, skipCollectionsSync: true }));
};

export const refreshUserSnapshot = async ({ dispatch, axiosPrivate }) => {
  let entries = await runSnapshotRequests({ dispatch, axiosPrivate });

  if (hasAuthFailure(entries)) {
    try {
      const refreshToken = sessionStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Create separate axios instance for refresh
      const refreshAxios = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });

      const refreshResponse = await refreshAxios.get("/auth/refresh-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      });
      
      const newAccessToken = refreshResponse?.data?.data?.token?.accessToken;
      
      if (newAccessToken) {
        sessionStorage.setItem('accessToken', newAccessToken);
        // Retry the snapshot requests with new token
        entries = await runSnapshotRequests({ dispatch, axiosPrivate });
      }
    } catch (error) {
      if (isAuthFailure(error)) {
        dispatch(logout());
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        return { status: "unauthenticated", entries };
      }

      throw error;
    }
  }

  const accountEntry = getSnapshotEntry(entries, "account");

  if (accountEntry?.result.status === "rejected") {
    if (isAuthFailure(accountEntry.result.reason)) {
      dispatch(logout());
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      return { status: "unauthenticated", entries };
    }

    throw accountEntry.result.reason;
  }

  const user = accountEntry?.result.value?.data?.data?.user ?? null;

  if (!user) {
    dispatch(logout());
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    return { status: "unauthenticated", entries };
  }

  applyUserSnapshot({ dispatch, user, entries });

  return {
    status: "authenticated",
    user,
    entries,
  };
};
