import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const token = window.sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!token) {
      return { user: null, isAuthenticated: false };
    }

    // For now, we'll validate token existence but not decode it here
    // The actual validation happens in AuthBootstrap
    return {
      user: null, // Will be populated by AuthBootstrap
      isAuthenticated: Boolean(token),
    };
  } catch (error) {
    console.error('Failed to load auth token from sessionStorage:', error);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, isAuthenticated: false };
  }
};

const persistAuth = (user, token, refreshToken) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (user && token) {
      window.sessionStorage.setItem(AUTH_STORAGE_KEY, token);
      if (refreshToken) {
        window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      return;
    }

    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to persist auth token to sessionStorage:', error);
  }
};

const persistedAuth = loadPersistedAuth();

const initialState = {
  user: persistedAuth.user,
  isAuthenticated: persistedAuth.isAuthenticated,
  isHydrating: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.isAuthenticated = Boolean(user);
      state.isHydrating = false;
      persistAuth(user, token, refreshToken);
    },
    finishHydration: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
      persistAuth(null, null, null);
    },
  },
});

export const { setCredentials, finishHydration, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsHydrating = (state) => state.auth.isHydrating;

export default authSlice.reducer;
