import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================
//                     BOOKING THUNKS
// ============================================================

/**
 * @desc  Fetch logged-in user's bookings
 *        GET /api/bookings/my-bookings
 */
export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMyBookings',
  async (_, { rejectWithValue, extra: axiosPrivate }) => {
    try {
      const { data } = await axiosPrivate.get('/bookings/my-bookings');
      return data.data.bookings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load bookings'
      );
    }
  }
);

/**
 * @desc  Cancel a booking
 *        PATCH /api/bookings/:id/cancel
 */
export const cancelBooking = createAsyncThunk(
  'booking/cancelBooking',
  async (id, { rejectWithValue, extra: axiosPrivate }) => {
    try {
      await axiosPrivate.patch(`/bookings/${id}/cancel`);
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

    // ── Cancel booking ─────────────────────────────────────
    cancelling:   false,
    cancelError:  null,
  },

  reducers: {
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
        state.bookings    = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.listLoading = false;
        state.listError   = action.payload;
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

export const { clearCancelError } = bookingSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectBookings    = (state) => state.booking.bookings;
export const selectListLoading = (state) => state.booking.listLoading;
export const selectListError   = (state) => state.booking.listError;
export const selectCancelling  = (state) => state.booking.cancelling;
export const selectCancelError = (state) => state.booking.cancelError;

export default bookingSlice.reducer;