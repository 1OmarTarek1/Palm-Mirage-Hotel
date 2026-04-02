import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPrivate } from '@/services/axiosInstance';

// ============================================================
//                     BOOKING THUNKS
// ============================================================

/**
 * @desc  Fetch logged-in user's bookings
 *        GET /api/reservations/my-bookings
 */
export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.get('/reservations/my-bookings');
      // The backend returns successResponse { message: "...", data: [...] }
      return data.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load bookings'
      );
    }
  }
);

/**
 * @desc  Create a new booking
 *        POST /api/reservations
 */
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.post('/reservations', bookingData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to create booking'
      );
    }
  }
);

/**
 * @desc  Cancel a booking
 *        DELETE /api/reservations/:id
 */
export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (id, { rejectWithValue }) => {
    try {
      await axiosPrivate.delete(`/reservations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to cancel booking'
      );
    }
  }
);

// ============================================================
//                     BOOKING SLICE
// ============================================================

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    // ── My bookings list ───────────────────────────────────
    bookings:     [],
    listLoading:  false,
    listError:    null,

    // ── Create booking ─────────────────────────────────────
    bookingLoading: false,
    bookingError:   null,
    lastBooking:    null,

    // ── Cancel booking ─────────────────────────────────────
    cancelling:   false,
    cancelError:  null,
  },

  reducers: {
    clearBookingState(state) {
      state.bookingError = null;
      state.lastBooking  = null;
    },
    clearCancelError(state) {
      state.cancelError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchMyBookings ────────────────────────────────────
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.listLoading = true;
        state.listError   = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.listLoading = false;
        state.bookings    = action.payload || [];
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.listLoading = false;
        state.listError   = action.payload;
      });

    // ── createBooking ──────────────────────────────────────
    builder
      .addCase(createBooking.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError   = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.lastBooking    = action.payload;
        // Optionally prepend to list
        state.bookings = [action.payload, ...state.bookings];
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError   = action.payload;
      });

    // ── cancelBooking ──────────────────────────────────────
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.cancelling  = true;
        state.cancelError = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelling = false;
        // update booking status to cancelled in the list
        const booking = state.bookings.find((b) => b._id === action.payload);
        if (booking) booking.status = 'cancelled';
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelling  = false;
        state.cancelError = action.payload;
      });
  },
});

export const { clearBookingState, clearCancelError } = bookingSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectBookings       = (state) => state.booking.bookings;
export const selectListLoading    = (state) => state.booking.listLoading;
export const selectListError      = (state) => state.booking.listError;
export const selectBookingLoading = (state) => state.booking.bookingLoading;
export const selectBookingError   = (state) => state.booking.bookingError;
export const selectLastBooking    = (state) => state.booking.lastBooking;
export const selectCancelling      = (state) => state.booking.cancelling;
export const selectCancelError    = (state) => state.booking.cancelError;

export default bookingSlice.reducer;