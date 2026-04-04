import { createSlice } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'authState';

const loadPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const rawAuthState = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawAuthState) {
      return { user: null, isAuthenticated: false };
    }

    const parsedAuthState = JSON.parse(rawAuthState);
    const user =
      parsedAuthState?.user && typeof parsedAuthState.user === 'object'
        ? parsedAuthState.user
        : null;

    return {
      user,
      isAuthenticated: Boolean(user),
    };
  } catch (error) {
    console.error('Failed to load auth state from localStorage:', error);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return { user: null, isAuthenticated: false };
  }
};

const persistAuth = (user) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (user) {
      window.localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user }),
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
  isAuthenticated: persistedAuth.isAuthenticated,
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
      persistAuth(user);
    },
    finishHydration: (state) => {
      state.isHydrating = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isHydrating = false;
      persistAuth(null);
    },
  },
});

export const { setCredentials, finishHydration, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsHydrating = (state) => state.auth.isHydrating;

export default authSlice.reducer;
