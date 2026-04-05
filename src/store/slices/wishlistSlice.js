import { createSlice } from '@reduxjs/toolkit';

const getRoomId = (room) => room?.id || room?._id || room?.roomNumber;

const normalizeWishlistItem = (item) => {
  const roomId = getRoomId(item);

  if (!roomId) {
    return null;
  }

  return {
    ...item,
    id: roomId,
  };
};

const normalizeWishlistItems = (items) =>
  Array.isArray(items)
    ? Array.from(
        new Map(
          items
            .map((item) => normalizeWishlistItem(item))
            .filter(Boolean)
            .map((item) => [item.id, item]),
        ).values(),
      )
    : [];

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    hydrateWishlist: (state, action) => {
      state.items = normalizeWishlistItems(action.payload);
    },
    resetWishlistState: (state) => {
      state.items = [];
    },
    addToWishlist: (state, action) => {
      const nextItem = normalizeWishlistItem(action.payload);
      const roomId = getRoomId(nextItem);
      const existing = state.items.find((i) => getRoomId(i) === roomId);
      if (roomId && !existing && nextItem) {
        state.items.push(nextItem);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => getRoomId(i) !== action.payload);
    },

    toggleWishlist: (state, action) => {
      const nextItem = normalizeWishlistItem(action.payload);
      const roomId = getRoomId(nextItem);
      const existing = state.items.find((i) => getRoomId(i) === roomId);
      if (existing) {
        state.items = state.items.filter((i) => getRoomId(i) !== roomId);
      } else if (roomId && nextItem) {
        state.items.push(nextItem);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  hydrateWishlist,
  resetWishlistState,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;

export const selectIsInWishlist = (state, roomId) =>
  state.wishlist.items.some((item) => getRoomId(item) === roomId);

export default wishlistSlice.reducer;
