import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================
//                     BOOKING THUNKS
// ============================================================

/**
 * @desc  Create a new table booking
 *        POST /api/booking/booking
 */
export const createTableBooking = createAsyncThunk(
  'restaurantBookings/createTableBooking',
  async ({ axiosPrivate, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.post('/booking/booking', payload);
      return data; // Returns newly created booking and waitlist message if any
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create table booking'
      );
    }
  }
);

// ============================================================
//                     BOOKING SLICE
// ============================================================

const restaurantBookingsSlice = createSlice({
  name: 'restaurantBookings',
  initialState: {
    // ── Create booking ─────────────────────────────────────
    creating:   false,
    createError:  null,
    lastBooking: null, // to store the last created booking/waitlist data
  },

  reducers: {
    clearCreateError(state) {
      state.createError = null;
    },
    clearLastBooking(state) {
      state.lastBooking = null;
    }
  },

  extraReducers: (builder) => {
    // ── createTableBooking ────────────────────────────────────
    builder
      .addCase(createTableBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
        state.lastBooking = null;
      })
      .addCase(createTableBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.lastBooking = action.payload;
      })
      .addCase(createTableBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      });
  },
});

export const { clearCreateError, clearLastBooking } = restaurantBookingsSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectCreatingTableBooking = (state) => state.restaurantBookings.creating;
export const selectTableBookingError    = (state) => state.restaurantBookings.createError;
export const selectLastTableBooking     = (state) => state.restaurantBookings.lastBooking;

export default restaurantBookingsSlice.reducer;
