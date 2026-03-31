import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import uiReducer from "./slices/uiSlice";
import wishlistReducer from "./slices/wishlistSlice";
import roomsReducer from "@/services/rooms/roomsSlice";
import activitiesReducer from "@/services/activities/activitiesSlice";
import activityBookingsReducer from "@/services/activityBookings/activityBookingsSlice";
import menuReducer from "@/services/menu/menuSlice";
import userReducer from "@/services/user/userSlice";
import bookingReducer from "@/services/booking/bookingSlice";
import restaurantBookingsReducer from "@/services/restaurantBookings/restaurantBookingsSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    wishlist: wishlistReducer,
    rooms: roomsReducer,
    activities: activitiesReducer,
    activityBookings: activityBookingsReducer,
    menu: menuReducer,
    user: userReducer,
    booking: bookingReducer,
    restaurantBookings: restaurantBookingsReducer,
  },
});
