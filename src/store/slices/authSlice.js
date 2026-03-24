import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) return rejectWithValue('No token');

    const { data } = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.data.user;
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      });
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
