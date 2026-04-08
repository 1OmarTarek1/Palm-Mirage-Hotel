import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { fetchUserPreferences, updateUserPreferences } from "@/services/userPreferencesApi";
import { logout, setCredentials } from "@/store/slices/authSlice";
import { mergeRestaurantMenuCarts } from "@/utils/restaurantMenuCart";
import {
  addItem,
  addRestaurantMenuToCart,
  clearCart,
  closeCart,
  hydrateCart,
  hydrateRestaurantMenuCart,
  hydratePendingRestaurantBookings,
  hydratePendingActivityBookings,
  removeItem,
  resetCartState,
  resetRestaurantMenuCart,
  setRestaurantMenuCartQty,
  updateItemBookingDates,
  updateQuantity,
  upsertRoomBooking,
  addPendingRestaurantBooking,
  updatePendingRestaurantBooking,
  removePendingRestaurantBooking,
  clearPendingRestaurantBookings,
  addPendingActivityBooking,
  updatePendingActivityBooking,
  removePendingActivityBooking,
  clearPendingActivityBookings,
} from "@/store/slices/cartSlice";
import {
  addToWishlist,
  clearWishlist,
  hydrateWishlist,
  removeFromWishlist,
  resetWishlistState,
  toggleWishlist,
} from "@/store/slices/wishlistSlice";

const getWishlistItemId = (item) => item?.id || item?._id || item?.roomNumber;

const mergeWishlistItems = (serverItems = [], currentItems = []) =>
  Array.from(
    new Map(
      [...serverItems, ...currentItems]
        .map((item) => {
          const id = getWishlistItemId(item);
          return id ? { ...item, id } : null;
        })
        .filter(Boolean)
        .map((item) => [item.id, item]),
    ).values(),
  );

const clearLegacyStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("cartItems");
  window.localStorage.removeItem("wishlist");
};

export const userCollectionsListenerMiddleware = createListenerMiddleware();

userCollectionsListenerMiddleware.startListening({
  actionCreator: setCredentials,
  effect: async (action, listenerApi) => {
    clearLegacyStorage();

    if (action.payload?.skipCollectionsSync) {
      return;
    }

    if (!action.payload?.user) {
      listenerApi.dispatch(resetCartState());
      listenerApi.dispatch(resetWishlistState());
      return;
    }

    try {
      const preferences = await fetchUserPreferences();
      const state = listenerApi.getState();
      const mergedCartItems = [...(preferences?.cartItems ?? []), ...(state.cart?.items ?? [])];
      const mergedWishlistItems = mergeWishlistItems(
        preferences?.wishlistItems ?? [],
        state.wishlist?.items ?? [],
      );
      const mergedRestaurantMenu = mergeRestaurantMenuCarts(
        preferences?.restaurantCart ?? {},
        state.cart?.restaurantMenuCart ?? {},
      );

      listenerApi.dispatch(hydrateCart(mergedCartItems));
      listenerApi.dispatch(hydrateWishlist(mergedWishlistItems));
      listenerApi.dispatch(hydrateRestaurantMenuCart(mergedRestaurantMenu));
      listenerApi.dispatch(hydratePendingRestaurantBookings(preferences?.pendingRestaurantBookings ?? []));
      listenerApi.dispatch(hydratePendingActivityBookings(preferences?.pendingActivityBookings ?? []));

      const hadLocalRestaurant =
        Object.keys(state.cart?.restaurantMenuCart ?? {}).length > 0;
      const hadLocalPendingRestaurant = (state.cart?.pendingRestaurantBookings?.length ?? 0) > 0;
      const hadLocalPendingActivity = (state.cart?.pendingActivityBookings?.length ?? 0) > 0;

      if (
        (state.cart?.items?.length ?? 0) > 0 ||
        (state.wishlist?.items?.length ?? 0) > 0 ||
        hadLocalRestaurant ||
        hadLocalPendingRestaurant ||
        hadLocalPendingActivity
      ) {
        await updateUserPreferences({
          cartItems: mergedCartItems,
          wishlistItems: mergedWishlistItems,
          restaurantCart: mergedRestaurantMenu,
          pendingRestaurantBookings: preferences?.pendingRestaurantBookings ?? state.cart?.pendingRestaurantBookings ?? [],
          pendingActivityBookings: preferences?.pendingActivityBookings ?? state.cart?.pendingActivityBookings ?? [],
        });
      }
    } catch (error) {
      // For local-first demos, don't let a failing preferences endpoint break the UX.
      console.warn("Preferences sync skipped (server unavailable):", error?.response?.status ?? error);
    }
  },
});

userCollectionsListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (_, listenerApi) => {
    clearLegacyStorage();
    listenerApi.dispatch(resetCartState());
    listenerApi.dispatch(resetWishlistState());
    listenerApi.dispatch(closeCart());
  },
});

userCollectionsListenerMiddleware.startListening({
  matcher: isAnyOf(
    addItem,
    upsertRoomBooking,
    removeItem,
    updateQuantity,
    updateQuantity,
    updateItemBookingDates,
    clearCart,
    addPendingRestaurantBooking,
    updatePendingRestaurantBooking,
    removePendingRestaurantBooking,
    clearPendingRestaurantBookings,
    addPendingActivityBooking,
    updatePendingActivityBooking,
    removePendingActivityBooking,
    clearPendingActivityBookings,
  ),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();

    if (!state.auth?.isAuthenticated) {
      return;
    }

    try {
      clearLegacyStorage();
      await updateUserPreferences({
        cartItems: state.cart?.items ?? [],
        restaurantCart: state.cart?.restaurantMenuCart ?? {},
        pendingRestaurantBookings: state.cart?.pendingRestaurantBookings ?? [],
        pendingActivityBookings: state.cart?.pendingActivityBookings ?? [],
      });
    } catch (error) {
      console.warn("Cart sync skipped (server unavailable):", error?.response?.status ?? error);
    }
  },
});

userCollectionsListenerMiddleware.startListening({
  matcher: isAnyOf(addRestaurantMenuToCart, setRestaurantMenuCartQty, resetRestaurantMenuCart),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();

    if (!state.auth?.isAuthenticated) {
      return;
    }

    try {
      clearLegacyStorage();
      await updateUserPreferences({
        restaurantCart: state.cart?.restaurantMenuCart ?? {},
        pendingRestaurantBookings: state.cart?.pendingRestaurantBookings ?? [],
      });
    } catch (error) {
      console.warn("Restaurant cart sync skipped (server unavailable):", error?.response?.status ?? error);
    }
  },
});

userCollectionsListenerMiddleware.startListening({
  matcher: isAnyOf(
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  ),
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState();

    if (!state.auth?.isAuthenticated) {
      return;
    }

    try {
      clearLegacyStorage();
      await updateUserPreferences({
        wishlistItems: state.wishlist?.items ?? [],
      });
    } catch (error) {
      console.warn("Wishlist sync skipped (server unavailable):", error?.response?.status ?? error);
    }
  },
});
