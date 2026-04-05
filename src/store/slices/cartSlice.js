import { createSlice } from "@reduxjs/toolkit";
import {
  buildCartBookingItem,
  calculateCartItemTotal,
  calculateNights,
  formatBookingDate,
  isCartItemReady,
} from "@/utils/roomBooking";

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
  },
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },
    hydrateCart: (state, action) => {
      state.items = mergeCartItems(Array.isArray(action.payload) ? action.payload : []);
    },
    resetCartState: (state) => {
      state.items = [];
      state.isOpen = false;
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
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  hydrateCart,
  resetCartState,
  addItem,
  upsertRoomBooking,
  removeItem,
  updateQuantity,
  updateItemBookingDates,
  clearCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartCount = (state) =>
  state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + calculateCartItemTotal(item), 0);
export const selectCartItemById = (state, id) =>
  state.cart.items.find((item) => item.id === id) || null;
export const selectCartRequiresAttention = (state) =>
  state.cart.items.some((item) => !isCartItemReady(item));

export default cartSlice.reducer;
