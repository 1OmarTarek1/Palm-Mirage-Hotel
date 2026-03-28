import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import useAxiosPrivate from '../../hooks/useAxiosPrivate';

// ============================================================
//                      USER THUNKS
// ============================================================

/**
 * @desc  Fetch logged-in user profile
 *        GET /api/users/me
 */
export const fetchMyProfile = createAsyncThunk(
  'user/fetchMyProfile',
  async (_, { rejectWithValue, extra: axiosPrivate }) => {
    try {
      const { data } = await axiosPrivate.get('/users/me');
      return data.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load profile'
      );
    }
  }
);

/**
 * @desc  Change logged-in user password
 *        PATCH /api/users/change-password
 */
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue, extra: axiosPrivate }) => {
    try {
      const { data } = await axiosPrivate.patch('/users/change-password', {
        currentPassword,
        newPassword,
      });
      return data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

// ============================================================
//                      USER SLICE
// ============================================================

const userSlice = createSlice({
  name: 'user',
  initialState: {
    // ── Profile ────────────────────────────────────────────
    profile:        null,
    profileLoading: false,
    profileError:   null,

    // ── Change Password ────────────────────────────────────
    passwordLoading: false,
    passwordError:   null,
    passwordSuccess: false,
  },

  reducers: {
    resetPasswordState(state) {
      state.passwordLoading = false;
      state.passwordError   = null;
      state.passwordSuccess = false;
    },
    clearProfile(state) {
      state.profile      = null;
      state.profileError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchMyProfile ─────────────────────────────────────
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError   = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile        = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError   = action.payload;
      });

    // ── changePassword ─────────────────────────────────────
    builder
      .addCase(changePassword.pending, (state) => {
        state.passwordLoading = true;
        state.passwordError   = null;
        state.passwordSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.passwordLoading = false;
        state.passwordSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.passwordError   = action.payload;
      });
  },
});

export const { resetPasswordState, clearProfile } = userSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectProfile        = (state) => state.user.profile;
export const selectProfileLoading = (state) => state.user.profileLoading;
export const selectProfileError   = (state) => state.user.profileError;
export const selectPasswordLoading = (state) => state.user.passwordLoading;
export const selectPasswordError  = (state) => state.user.passwordError;
export const selectPasswordSuccess = (state) => state.user.passwordSuccess;

export default userSlice.reducer;