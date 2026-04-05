import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const getErrorMessage = (err, fallbackMessage) =>
  err.response?.data?.details?.[0]?.message ||
  err.response?.data?.message ||
  fallbackMessage;

const normalizeRestaurantBooking = (booking) => {
  if (!booking) return null;

  return {
    ...booking,
    id: booking._id ?? booking.id,
    tableNumber:
      booking.tableNumber === null || booking.tableNumber === undefined
        ? null
        : Number(booking.tableNumber),
    guests: Number(booking.guests ?? 0),
  };
};

export const createTableBooking = createAsyncThunk(
  'restaurantBookings/createTableBooking',
  async ({ axiosPrivate, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.post('/booking/booking', payload);
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create table booking'));
    }
  }
);

export const fetchMyTableBookings = createAsyncThunk(
  'restaurantBookings/fetchMyTableBookings',
  async (axiosPrivate, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.get('/booking/my-bookings');
      return (data?.data?.bookings ?? []).map(normalizeRestaurantBooking);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load table bookings'));
    }
  }
);

export const cancelTableBooking = createAsyncThunk(
  'restaurantBookings/cancelTableBooking',
  async ({ axiosPrivate, bookingId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.patch(`/booking/${bookingId}/cancel`);
      return normalizeRestaurantBooking(data?.data?.booking);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to cancel table booking'));
    }
  }
);

const restaurantBookingsSlice = createSlice({
  name: 'restaurantBookings',
  initialState: {
    bookings: [],
    listLoading: false,
    listError: null,
    creating: false,
    createError: null,
    lastBooking: null,
    cancelling: false,
    cancelError: null,
  },

  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
    clearLastBooking(state) {
      state.lastBooking = null;
    },
    clearTableBookingErrors(state) {
      state.listError = null;
      state.createError = null;
      state.cancelError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyTableBookings.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchMyTableBookings.fulfilled, (state, action) => {
        state.listLoading = false;
        state.bookings = action.payload ?? [];
      })
      .addCase(fetchMyTableBookings.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(createTableBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.lastBooking = null;
      })
      .addCase(createTableBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.lastBooking = action.payload;

        const nextBooking = normalizeRestaurantBooking(action.payload?.data?.booking);
        if (nextBooking) {
          const existingIndex = state.bookings.findIndex((booking) => booking.id === nextBooking.id);
          if (existingIndex >= 0) {
            state.bookings[existingIndex] = nextBooking;
          } else {
            state.bookings.unshift(nextBooking);
          }
        }
      })
      .addCase(createTableBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      .addCase(cancelTableBooking.pending, (state) => {
        state.cancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelTableBooking.fulfilled, (state, action) => {
        state.cancelling = false;
        state.cancelError = null;

        if (action.payload) {
          const existingIndex = state.bookings.findIndex((booking) => booking.id === action.payload.id);
          if (existingIndex >= 0) {
            state.bookings[existingIndex] = action.payload;
          } else {
            state.bookings.unshift(action.payload);
          }
        }
      })
      .addCase(cancelTableBooking.rejected, (state, action) => {
        state.cancelling = false;
        state.cancelError = action.payload;
      });
  },
});

export const { clearCreateError, clearLastBooking, clearTableBookingErrors } =
  restaurantBookingsSlice.actions;

export const selectTableBookings = (state) => state.restaurantBookings.bookings;
export const selectTableBookingsLoading = (state) => state.restaurantBookings.listLoading;
export const selectTableBookingsError = (state) => state.restaurantBookings.listError;
export const selectCreatingTableBooking = (state) => state.restaurantBookings.creating;
export const selectTableBookingError = (state) => state.restaurantBookings.createError;
export const selectLastTableBooking = (state) => state.restaurantBookings.lastBooking;
export const selectCancellingTableBooking = (state) => state.restaurantBookings.cancelling;
export const selectCancelTableBookingError = (state) => state.restaurantBookings.cancelError;

export default restaurantBookingsSlice.reducer;
