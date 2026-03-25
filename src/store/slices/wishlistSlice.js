import { createSlice } from '@reduxjs/toolkit';

const loadWishlistFromLocalStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  } catch (error) {
    console.error('Failed to load wishlist from localStorage:', error);
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlistFromLocalStorage(), // [{ id, name, image, price, type, beds, size, guests }]
  },
  reducers: {
    addToWishlist: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (!existing) {
        state.items.push(action.payload);
        // Persist to localStorage
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },

    toggleWishlist: (state, action) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        state.items = state.items.filter((i) => i.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },

    clearWishlist: (state) => {
      state.items = [];
      // Persist to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;

export const selectIsInWishlist = (state, roomId) =>
  state.wishlist.items.some((item) => item.id === roomId);

export default wishlistSlice.reducer;
