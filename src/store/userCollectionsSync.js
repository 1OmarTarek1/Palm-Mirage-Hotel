import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";

import { fetchUserPreferences, updateUserPreferences } from "@/services/userPreferencesApi";
import { logout, setCredentials } from "@/store/slices/authSlice";
import {
  addItem,
  clearCart,
  hydrateCart,
  removeItem,
  resetCartState,
  updateItemBookingDates,
  updateQuantity,
  upsertRoomBooking,
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

      listenerApi.dispatch(hydrateCart(mergedCartItems));
      listenerApi.dispatch(hydrateWishlist(mergedWishlistItems));

      if ((state.cart?.items?.length ?? 0) > 0 || (state.wishlist?.items?.length ?? 0) > 0) {
        await updateUserPreferences({
          cartItems: mergedCartItems,
          wishlistItems: mergedWishlistItems,
        });
      }
    } catch (error) {
      console.error("Failed to hydrate user collections from the database:", error);
    }
  },
});

userCollectionsListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async (_, listenerApi) => {
    clearLegacyStorage();
    listenerApi.dispatch(resetCartState());
    listenerApi.dispatch(resetWishlistState());
  },
});

userCollectionsListenerMiddleware.startListening({
  matcher: isAnyOf(
    addItem,
    upsertRoomBooking,
    removeItem,
    updateQuantity,
    updateItemBookingDates,
    clearCart,
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
      });
    } catch (error) {
      console.error("Failed to sync cart items to the database:", error);
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
      console.error("Failed to sync wishlist items to the database:", error);
    }
  },
});
