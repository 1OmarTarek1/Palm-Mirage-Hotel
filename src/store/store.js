import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
  },
});


