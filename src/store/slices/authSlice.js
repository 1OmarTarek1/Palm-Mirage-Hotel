import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'authState';

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isAuthenticated: false };
  }

  try {
    const rawAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawAuthState) {
      return { user: null, token: null, isAuthenticated: false };
    }

    const parsedAuthState = JSON.parse(rawAuthState);
    const user =
      parsedAuthState?.user && typeof parsedAuthState.user === 'object'
        ? parsedAuthState.user
        : null;
    const token = parsedAuthState?.token || null;

    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
    };
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, token: null, isAuthenticated: false };
  }
};

const persistAuth = (user, token) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (user && token) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user, token }),
      );
      return;
    }

    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to persist auth state to localStorage:', error);
  }
};

const persistedAuth = loadPersistedAuth();

const initialState = {
  user: persistedAuth.user,
  token: persistedAuth.token,
  isAuthenticated: persistedAuth.isAuthenticated,
  isHydrating: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = Boolean(user && token);
      state.isHydrating = false;
      persistAuth(user, token);
    },
    finishHydration: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
      persistAuth(null, null);
    },
  },
});

export const { setCredentials, finishHydration, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsHydrating = (state) => state.auth.isHydrating;

export default authSlice.reducer;
