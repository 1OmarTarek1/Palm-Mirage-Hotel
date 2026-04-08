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
import {
  hydrateCart,
  hydrateRestaurantMenuCart,
  hydratePendingActivityBookings,
  hydratePendingRestaurantBookings,
} from "@/store/slices/cartSlice";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { hydrateWishlist } from "@/store/slices/wishlistSlice";

const isAuthFailure = (error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403) return true;
  if (status !== 400) return false;

  const message = String(error?.response?.data?.message || "").toLowerCase();
  return /authorization|token|credential|in-valid|invalid account|deleted/.test(message);
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
    ({ key, result }) =>
      (key === "account" || key === "preferences") &&
      result.status === "rejected" &&
      isAuthFailure(result.reason),
  );

const getSnapshotEntry = (entries = [], key) =>
  entries.find((entry) => entry.key === key);

const clearSessionAndLogout = (dispatch) => {
  dispatch(logout());
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const applyUserSnapshot = ({ dispatch, user, entries = [] }) => {
  const preferencesEntry = getSnapshotEntry(entries, "preferences");

  if (preferencesEntry?.result.status === "fulfilled") {
    const preferences = preferencesEntry.result.value ?? {};
    dispatch(hydrateCart(preferences.cartItems ?? []));
    dispatch(hydrateWishlist(preferences.wishlistItems ?? []));
    dispatch(hydrateRestaurantMenuCart(preferences.restaurantCart ?? {}));
    dispatch(hydratePendingRestaurantBookings(preferences.pendingRestaurantBookings ?? []));
    dispatch(hydratePendingActivityBookings(preferences.pendingActivityBookings ?? []));
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

  // No refresh-token flow on the Website: if auth fails, treat it as a logged-out session.
  if (hasAuthFailure(entries)) {
    console.warn("Snapshot requests failed with an auth error; signing out:", entries);
    clearSessionAndLogout(dispatch);
    return { status: "unauthenticated", entries };
  }

  const accountEntry = getSnapshotEntry(entries, "account");

  if (accountEntry?.result.status === "rejected") {
    if (isAuthFailure(accountEntry.result.reason)) {
      console.warn("Failed to fetch account, signing out stale session:", accountEntry.result.reason);
      clearSessionAndLogout(dispatch);
      return { status: "unauthenticated", entries };
    }

    throw accountEntry.result.reason;
  }

  const user = accountEntry?.result.value?.data?.data?.user ?? null;

  if (!user) {
    clearSessionAndLogout(dispatch);
    return { status: "unauthenticated", entries };
  }

  applyUserSnapshot({ dispatch, user, entries });

  return {
    status: "authenticated",
    user,
    entries,
  };
};
