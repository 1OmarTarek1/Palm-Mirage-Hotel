import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,

  },
});

