import { createSlice } from "@reduxjs/toolkit";
import {
  buildCartBookingItem,
  calculateCartItemTotal,
  calculateNights,
  formatBookingDate,
  isCartItemReady,
} from "@/utils/roomBooking";
import { sanitizeRestaurantMenuCart } from "@/utils/restaurantMenuCart";

const resolveCartItemImage = (item) => {
  if (typeof item?.image === "string" && item.image) return item.image;
  if (typeof item?.image?.secure_url === "string" && item.image.secure_url) {
    return item.image.secure_url;
  }
  if (typeof item?.image?.url === "string" && item.image.url) {
    return item.image.url;
  }

  const imageCollections = [
    item?.images,
    item?.roomImages,
    item?.room?.images,
    item?.room?.roomImages,
  ];

  for (const collection of imageCollections) {
    if (!Array.isArray(collection) || collection.length === 0) continue;

    const firstImage = collection[0];
    if (typeof firstImage === "string" && firstImage) return firstImage;
    if (typeof firstImage?.secure_url === "string" && firstImage.secure_url) {
      return firstImage.secure_url;
    }
    if (typeof firstImage?.url === "string" && firstImage.url) {
      return firstImage.url;
    }
  }

  return "";
};

const normalizeCartItem = (item) => {
  const image = resolveCartItemImage(item);
  const name = item?.name || item?.roomName || item?.title || "Item";
  const category = item?.category || item?.type || item?.roomType || "general";
  const rawId = item?.id || item?._id || item?.roomId || item?.room?._id;
  const id = rawId || `${name}-${category}-${image || "no-image"}`;
  const price = Number(item?.price || 0);
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const nights = Number(item?.nights || 0);
  const checkInDate = formatBookingDate(item?.checkInDate);
  const checkOutDate = formatBookingDate(item?.checkOutDate);
  const roomsCount = Math.max(1, Number(item?.roomsCount || 1));
  const adults = Math.max(1, Number(item?.adults || 1));
  const children = Math.max(0, Number(item?.children || 0));
  const availabilityStatus = item?.availabilityStatus || "unknown";

  return {
    ...item,
    id,
    name,
    category,
    image,
    price,
    quantity,
    nights: nights || calculateNights(checkInDate, checkOutDate),
    checkInDate,
    checkOutDate,
    roomsCount,
    adults,
    children,
    guests: adults + children,
    availabilityStatus,
  };
};

const mergeCartItems = (items) => {
  const mergedItems = [];

  items.forEach((rawItem) => {
    const item = normalizeCartItem(rawItem);
    const existing = mergedItems.find((entry) => entry.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
      if (!existing.image && item.image) existing.image = item.image;
      if (!existing.name && item.name) existing.name = item.name;
      if (!existing.category && item.category) existing.category = item.category;
      if (!existing.nights && item.nights) existing.nights = item.nights;
      if (!existing.price && item.price) existing.price = item.price;
    } else {
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isOpen: false,
    /** "rooms" | "restaurant" — which pane is visible in the cart sidebar */
    sidebarTab: "rooms",
    /** Restaurant menu picks — persisted to user preferences like room cart */
    restaurantMenuCart: {},
    /** Pending restaurant bookings from cart page */
    pendingRestaurantBookings: [],
    /** Pending activity bookings from cart page */
    pendingActivityBookings: [],
  },
  reducers: {
    openCart: (state, action) => {
      state.isOpen = true;
      if (action.payload?.tab === "rooms" || action.payload?.tab === "restaurant") {
        state.sidebarTab = action.payload.tab;
      }
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      if (state.isOpen) {
        state.isOpen = false;
      } else {
        state.isOpen = true;
        state.sidebarTab = "rooms";
      }
    },
    setCartSidebarTab: (state, action) => {
      if (action.payload === "rooms" || action.payload === "restaurant" || action.payload === "activities") {
        state.sidebarTab = action.payload;
      }
    },
    hydrateCart: (state, action) => {
      state.items = mergeCartItems(Array.isArray(action.payload) ? action.payload : []);
    },
    hydrateRestaurantMenuCart: (state, action) => {
      state.restaurantMenuCart = sanitizeRestaurantMenuCart(action.payload);
    },
    hydratePendingRestaurantBookings: (state, action) => {
      state.pendingRestaurantBookings = Array.isArray(action.payload) ? action.payload : [];
    },
    hydratePendingActivityBookings: (state, action) => {
      state.pendingActivityBookings = Array.isArray(action.payload) ? action.payload : [];
    },
    addRestaurantMenuToCart: (state, action) => {
      const id = String(action.payload?.itemId ?? "").trim();
      if (!id) return;
      const delta = typeof action.payload?.delta === "number" ? action.payload.delta : 1;
      const prev = state.restaurantMenuCart[id] ?? 0;
      const next = prev + delta;
      if (next <= 0) {
        delete state.restaurantMenuCart[id];
      } else {
        state.restaurantMenuCart[id] = Math.min(99, next);
      }
    },
    setRestaurantMenuCartQty: (state, action) => {
      const id = String(action.payload?.id ?? "").trim();
      if (!id) return;
      const qty = Math.floor(Number(action.payload?.qty));
      if (!Number.isFinite(qty) || qty <= 0) {
        delete state.restaurantMenuCart[id];
      } else {
        state.restaurantMenuCart[id] = Math.min(99, qty);
      }
    },
    resetRestaurantMenuCart: (state) => {
      state.restaurantMenuCart = {};
    },
    resetCartState: (state) => {
      state.items = [];
      state.isOpen = false;
      state.sidebarTab = "rooms";
      state.restaurantMenuCart = {};
      state.pendingRestaurantBookings = [];
      state.pendingActivityBookings = [];
    },

    addItem: (state, action) => {
      const incomingItem = normalizeCartItem(action.payload);
      const existing = state.items.find((i) => i.id === incomingItem.id);
      if (existing) {
        Object.assign(existing, {
          ...existing,
          ...incomingItem,
          quantity: 1,
        });
      } else {
        state.items.push(incomingItem);
      }
    },

    upsertRoomBooking: (state, action) => {
      const incomingItem = buildCartBookingItem(action.payload.room, action.payload.bookingDraft);
      if (!incomingItem) return;

      const existingIndex = state.items.findIndex((item) => item.id === incomingItem.id);

      if (existingIndex >= 0) {
        state.items[existingIndex] = {
          ...state.items[existingIndex],
          ...incomingItem,
        };
      } else {
        state.items.push(incomingItem);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = 1;
        }
      }
    },

    updateItemBookingDates: (state, action) => {
      const { id, bookingDraft } = action.payload;
      const item = state.items.find((entry) => entry.id === id);
      if (!item) return;

      item.checkInDate = formatBookingDate(bookingDraft?.checkInDate);
      item.checkOutDate = formatBookingDate(bookingDraft?.checkOutDate);
      item.adults = Math.max(1, Number(bookingDraft?.adults || item.adults || 1));
      item.children = Math.max(0, Number(bookingDraft?.children || item.children || 0));
      item.guests = item.adults + item.children;
      item.roomsCount = Math.max(1, Number(bookingDraft?.roomsCount || item.roomsCount || 1));
      item.nights = calculateNights(item.checkInDate, item.checkOutDate);
      item.availabilityStatus = bookingDraft?.availabilityStatus || item.availabilityStatus || "unknown";
      item.availabilityCheckedAt = bookingDraft?.availabilityCheckedAt || new Date().toISOString();
    },

    clearCart: (state) => {
      state.items = [];
    },

    // Pending Restaurant Bookings
    addPendingRestaurantBooking: (state, action) => {
      const booking = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.pendingRestaurantBookings.push(booking);
    },

    updatePendingRestaurantBooking: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.pendingRestaurantBookings.findIndex(booking => booking.id === id);
      if (index >= 0) {
        state.pendingRestaurantBookings[index] = {
          ...state.pendingRestaurantBookings[index],
          ...updates,
        };
      }
    },

    removePendingRestaurantBooking: (state, action) => {
      state.pendingRestaurantBookings = state.pendingRestaurantBookings.filter(
        booking => booking.id !== action.payload
      );
    },

    clearPendingRestaurantBookings: (state) => {
      state.pendingRestaurantBookings = [];
    },

    // Pending Activity Bookings
    addPendingActivityBooking: (state, action) => {
      const booking = {
        ...action.payload,
        id: action.payload.id || Date.now().toString(),
        createdAt: action.payload.createdAt || new Date().toISOString(),
      };
      state.pendingActivityBookings.push(booking);
    },

    updatePendingActivityBooking: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.pendingActivityBookings.findIndex(booking => booking.id === id);
      if (index >= 0) {
        state.pendingActivityBookings[index] = {
          ...state.pendingActivityBookings[index],
          ...updates,
        };
      }
    },

    removePendingActivityBooking: (state, action) => {
      state.pendingActivityBookings = state.pendingActivityBookings.filter(
        booking => booking.id !== action.payload
      );
    },

    clearPendingActivityBookings: (state) => {
      state.pendingActivityBookings = [];
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  setCartSidebarTab,
  hydrateCart,
  hydrateRestaurantMenuCart,
  hydratePendingRestaurantBookings,
  hydratePendingActivityBookings,
  addRestaurantMenuToCart,
  setRestaurantMenuCartQty,
  resetRestaurantMenuCart,
  resetCartState,
  addItem,
  upsertRoomBooking,
  removeItem,
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
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartSidebarTab = (state) => state.cart.sidebarTab;
export const selectCartCount = (state) =>
  state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + calculateCartItemTotal(item), 0);
export const selectCartItemById = (state, id) =>
  state.cart.items.find((item) => item.id === id) || null;
export const selectCartRequiresAttention = (state) =>
  state.cart.items.some((item) => !isCartItemReady(item));

export const selectRestaurantMenuCart = (state) => state.cart.restaurantMenuCart ?? {};

export const selectRestaurantMenuCartTotalQty = (state) => {
  const m = state.cart.restaurantMenuCart ?? {};
  return Object.values(m).reduce((s, q) => s + (typeof q === "number" ? q : 0), 0);
};

// Pending Bookings Selectors
export const selectPendingRestaurantBookings = (state) => state.cart.pendingRestaurantBookings || [];
export const selectPendingActivityBookings = (state) => state.cart.pendingActivityBookings || [];
export const selectPendingRestaurantBookingById = (state, id) =>
  state.cart.pendingRestaurantBookings.find(booking => booking.id === id) || null;
export const selectPendingActivityBookingById = (state, id) =>
  state.cart.pendingActivityBookings.find(booking => booking.id === id) || null;

// Calculate totals for pending bookings
export const selectPendingRestaurantTotal = (state) => {
  return state.cart.pendingRestaurantBookings.reduce((sum, booking) => {
    return sum + (booking.lineItems?.reduce((itemSum, item) => {
      return itemSum + (item.price * item.qty);
    }, 0) || 0);
  }, 0);
};

export const selectPendingActivityTotal = (state) => {
  return state.cart.pendingActivityBookings.reduce((sum, booking) => {
    return sum + (booking.price * booking.guests || 0);
  }, 0);
};

export const selectAllPendingTotal = (state) => {
  return selectPendingRestaurantTotal(state) + selectPendingActivityTotal(state);
};

export default cartSlice.reducer;
