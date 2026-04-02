import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isHydrating: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthenticated = Boolean(user);
      state.isHydrating = false;
    },
    finishHydration: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
    },
  },
});

export const { setCredentials, finishHydration, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsHydrating = (state) => state.auth.isHydrating;

export default authSlice.reducer;
