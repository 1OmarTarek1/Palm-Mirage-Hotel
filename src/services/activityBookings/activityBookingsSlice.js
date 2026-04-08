import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const activeStatuses = ['pending', 'awaiting_payment', 'confirmed'];

const getErrorMessage = (err, fallbackMessage) =>
  err.response?.data?.details?.[0]?.message ||
  err.response?.data?.message ||
  fallbackMessage;

export const fetchMyActivityBookings = createAsyncThunk(
  'activityBookings/fetchMyActivityBookings',
  async (axiosPrivate, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.get('/activity-bookings/my-bookings');
      return data?.data?.bookings ?? [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load activity bookings'));
    }
  }
);

export const createActivityBooking = createAsyncThunk(
  'activityBookings/createActivityBooking',
  async ({ axiosPrivate, payload }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.post('/activity-bookings', payload);
      return data?.data?.booking;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create activity booking'));
    }
  }
);

export const cancelActivityBooking = createAsyncThunk(
  'activityBookings/cancelActivityBooking',
  async ({ axiosPrivate, bookingId, cancellationReason = '' }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.patch(`/activity-bookings/${bookingId}/cancel`, {
        cancellationReason,
      });
      return data?.data?.booking;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to cancel activity booking'));
    }
  }
);

export const createActivityCheckoutSession = createAsyncThunk(
  'activityBookings/createActivityCheckoutSession',
  async ({ axiosPrivate, activityBookingId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosPrivate.post('/payment/create-activity-checkout-session', {
        activityBookingId,
      });
      return data?.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to start payment'));
    }
  }
);

const activityBookingsSlice = createSlice({
  name: 'activityBookings',
  initialState: {
    bookings: [],
    listLoading: false,
    listError: null,
    creating: false,
    createError: null,
    cancelling: false,
    cancelError: null,
    lastCreatedBooking: null,
    checkoutLoading: false,
  },
  reducers: {
    clearCreateActivityBookingState(state) {
      state.creating = false;
      state.createError = null;
      state.lastCreatedBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyActivityBookings.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchMyActivityBookings.fulfilled, (state, action) => {
        state.listLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyActivityBookings.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      })
      .addCase(createActivityBooking.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createActivityBooking.fulfilled, (state, action) => {
        state.creating = false;
        state.createError = null;
        state.lastCreatedBooking = action.payload;
        if (action.payload) {
          const existingIndex = state.bookings.findIndex((booking) => booking._id === action.payload._id);
          if (existingIndex >= 0) {
            state.bookings[existingIndex] = action.payload;
          } else {
            state.bookings.unshift(action.payload);
          }
        }
      })
      .addCase(createActivityBooking.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      .addCase(cancelActivityBooking.pending, (state) => {
        state.cancelling = true;
        state.cancelError = null;
      })
      .addCase(cancelActivityBooking.fulfilled, (state, action) => {
        state.cancelling = false;
        state.cancelError = null;
        if (action.payload) {
          const existingIndex = state.bookings.findIndex((booking) => booking._id === action.payload._id);
          if (existingIndex >= 0) {
            state.bookings[existingIndex] = action.payload;
          } else {
            state.bookings.unshift(action.payload);
          }
        }
      })
      .addCase(cancelActivityBooking.rejected, (state, action) => {
        state.cancelling = false;
        state.cancelError = action.payload;
      })
      .addCase(createActivityCheckoutSession.pending, (state) => {
        state.checkoutLoading = true;
      })
      .addCase(createActivityCheckoutSession.fulfilled, (state) => {
        state.checkoutLoading = false;
      })
      .addCase(createActivityCheckoutSession.rejected, (state) => {
        state.checkoutLoading = false;
      });
  },
});

export const { clearCreateActivityBookingState } = activityBookingsSlice.actions;

export const selectActivityBookings = (state) => state.activityBookings.bookings;
export const selectActivityBookingsLoading = (state) => state.activityBookings.listLoading;
export const selectActivityBookingsError = (state) => state.activityBookings.listError;
export const selectCreatingActivityBooking = (state) => state.activityBookings.creating;
export const selectCreateActivityBookingError = (state) => state.activityBookings.createError;
export const selectCancellingActivityBooking = (state) => state.activityBookings.cancelling;
export const selectCancelActivityBookingError = (state) => state.activityBookings.cancelError;
export const selectLastCreatedActivityBooking = (state) => state.activityBookings.lastCreatedBooking;
export const selectActivityCheckoutLoading = (state) => state.activityBookings.checkoutLoading;
export const selectActiveActivityBookings = createSelector(
  [selectActivityBookings],
  (bookings) => bookings.filter((booking) => activeStatuses.includes(booking.status))
);

export default activityBookingsSlice.reducer;

