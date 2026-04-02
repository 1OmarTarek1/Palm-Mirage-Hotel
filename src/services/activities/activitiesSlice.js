import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '../../services/axiosInstance';

// ============================================================
//                    ACTIVITIES THUNKS
// ============================================================

/**
 * @desc  Fetch all activities
 *        GET /api/activities
 */
export const fetchAllActivities = createAsyncThunk(
  'activities/fetchAllActivities',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/activities');
      return data.data.activities;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load activities'
      );
    }
  }
);

/**
 * @desc  Fetch a single activity by id
 *        GET /api/activities/:id
 */
export const fetchActivityById = createAsyncThunk(
  'activities/fetchActivityById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/activities/${id}`);
      return data.data.activity;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Activity not found'
      );
    }
  }
);

// ============================================================
//                    ACTIVITIES SLICE
// ============================================================

const activitiesSlice = createSlice({
  name: 'activities',
  initialState: {
    // ── All activities list ────────────────────────────────
    activities:   [],
    listLoading:  false,
    listError:    null,

    // ── Single activity details ────────────────────────────
    activity:         null,
    activityLoading:  false,
    activityError:    null,
  },

  reducers: {
    clearActivity(state) {
      state.activity      = null;
      state.activityError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchAllActivities ─────────────────────────────────
    builder
      .addCase(fetchAllActivities.pending, (state) => {
        state.listLoading = true;
        state.listError   = null;
      })
      .addCase(fetchAllActivities.fulfilled, (state, action) => {
        state.listLoading  = false;
        state.activities   = action.payload;
      })
      .addCase(fetchAllActivities.rejected, (state, action) => {
        state.listLoading = false;
        state.listError   = action.payload;
      });

    // ── fetchActivityById ──────────────────────────────────
    builder
      .addCase(fetchActivityById.pending, (state) => {
        state.activityLoading = true;
        state.activityError   = null;
        state.activity        = null;
      })
      .addCase(fetchActivityById.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.activity        = action.payload;
      })
      .addCase(fetchActivityById.rejected, (state, action) => {
        state.activityLoading = false;
        state.activityError   = action.payload;
      });
  },
});

export const { clearActivity } = activitiesSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectActivities      = (state) => state.activities.activities;
export const selectListLoading     = (state) => state.activities.listLoading;
export const selectListError       = (state) => state.activities.listError;
export const selectActivity        = (state) => state.activities.activity;
export const selectActivityLoading = (state) => state.activities.activityLoading;
export const selectActivityError   = (state) => state.activities.activityError;

export default activitiesSlice.reducer;