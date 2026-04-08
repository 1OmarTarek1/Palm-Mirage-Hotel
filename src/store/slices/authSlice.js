import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_STORAGE_KEY = "user";

const forceClearAuthStorage = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to force-clear auth storage:", error);
  }
};

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = window.localStorage.getItem(USER_STORAGE_KEY);
    
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
      } else if (!window.localStorage.getItem(REFRESH_TOKEN_KEY)) {
        // Keep storage shape predictable when token exists but no refresh token is available.
        window.localStorage.removeItem(REFRESH_TOKEN_KEY);
      }
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    forceClearAuthStorage();
  } catch (error) {
    console.error('Failed to persist auth token to localStorage:', error);
  }
};

const persistedAuth = loadPersistedAuth();

const initialState = {
  user: persistedAuth.user,
  // Demo/prod friendly: if token+user exist in localStorage, consider session active.
  isAuthenticated: persistedAuth.isAuthenticated,
  isHydrating: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      const persistedToken =
        typeof window !== "undefined" ? window.localStorage.getItem(AUTH_STORAGE_KEY) : null;
      const persistedRefreshToken =
        typeof window !== "undefined" ? window.localStorage.getItem(REFRESH_TOKEN_KEY) : null;

      // Allow profile-only refreshes to update user data without dropping existing session tokens.
      const effectiveToken = token || persistedToken;
      const effectiveRefreshToken = refreshToken || persistedRefreshToken;
      const hasValidSession = Boolean(user && effectiveToken);

      state.user = hasValidSession ? user : null;
      state.isAuthenticated = hasValidSession;
      state.isHydrating = false;
      persistAuth(hasValidSession ? user : null, effectiveToken, effectiveRefreshToken);
      if (!hasValidSession) {
        forceClearAuthStorage();
      }
    },
    finishHydration: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
      persistAuth(null, null, null);
      forceClearAuthStorage();
    },
  },
});

export const { setCredentials, finishHydration, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsHydrating = (state) => state.auth.isHydrating;

export default authSlice.reducer;
