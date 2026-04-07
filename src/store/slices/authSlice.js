import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = window.localStorage.getItem("user");
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return { user, isAuthenticated: true };
    }
    return { user: null, isAuthenticated: false };
  } catch (error) {
    console.error('Failed to load auth from localStorage:', error);
    return { user: null, isAuthenticated: false };
  }
};

const persistAuth = (user, token, refreshToken) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (user && token) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, token);
      if (refreshToken) {
        window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      window.localStorage.setItem("user", JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem("user");
  } catch (error) {
    console.error('Failed to persist auth token to localStorage:', error);
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
