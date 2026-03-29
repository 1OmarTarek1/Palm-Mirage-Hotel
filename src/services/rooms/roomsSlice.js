import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "@/services/axiosInstance";

// ============================================================
//                      ROOMS THUNKS
// ============================================================

/**
 * @desc  Fetch all rooms
 *        GET /api/rooms
 */
export const fetchAllRooms = createAsyncThunk(
  "rooms/fetchAllRooms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/rooms");
      return data.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load rooms",
      );
    }
  },
);

/**
 * @desc  Fetch a single room by id
 *        GET /api/rooms/:id
 */
export const fetchRoomById = createAsyncThunk(
  "rooms/fetchRoomById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/rooms/${id}`);
      return data.data.room;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Room not found");
    }
  },
);

// ============================================================
//                      ROOMS SLICE
// ============================================================

const roomsSlice = createSlice({
  name: "rooms",
  initialState: {
    // ── All rooms list ─────────────────────────────────────
    rooms: [],
    listLoading: false,
    listError: null,

    // ── Single room details ────────────────────────────────
    room: null,
    roomLoading: false,
    roomError: null,
  },

  reducers: {
    clearRoom(state) {
      state.room = null;
      state.roomError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchAllRooms ──────────────────────────────────────
    builder
      .addCase(fetchAllRooms.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchAllRooms.fulfilled, (state, action) => {
        state.listLoading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchAllRooms.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // ── fetchRoomById ──────────────────────────────────────
    builder
      .addCase(fetchRoomById.pending, (state) => {
        state.roomLoading = true;
        state.roomError = null;
        state.room = null;
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.roomLoading = false;
        state.room = action.payload;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.roomLoading = false;
        state.roomError = action.payload;
      });
  },
});

export const { clearRoom } = roomsSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectRooms = (state) => state.rooms.rooms;
export const selectListLoading = (state) => state.rooms.listLoading;
export const selectListError = (state) => state.rooms.listError;
export const selectRoom = (state) => state.rooms.room;
export const selectRoomLoading = (state) => state.rooms.roomLoading;
export const selectRoomError = (state) => state.rooms.roomError;

export default roomsSlice.reducer;
