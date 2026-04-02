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
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/rooms", {
        params: { page, limit },
      });

      // Robust data extraction: check data.data.rooms, data.data, or data itself
      const responseData = data?.data?.rooms || data?.data || data;
      
      if (Array.isArray(responseData?.data)) {
        return {
          rooms: responseData.data,
          page,
          limit,
          totalPages: 1,
          totalItems: responseData.data.length,
        };
      }

      if (Array.isArray(responseData)) {
        return {
          rooms: responseData,
          page,
          limit,
          totalPages: 1,
          totalItems: responseData.length,
        };
      }

      return {
        rooms: responseData?.data || responseData || [],
        page: responseData?.page || page,
        limit: responseData?.limit || limit,
        totalPages: responseData?.totalPages || responseData?.pages || 1,
        totalItems: responseData?.totalItems || responseData?.total || 0,
      };
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
      // Return data.data._doc (Mongoose), data.data.room, data.data, or data itself
      return data?.data?._doc || data?.data?.room || data?.data || data;
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
    listPage: 1,
    listLimit: 20,
    listTotalPages: 1,
    listTotalItems: 0,

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
        const payload = action.payload;

        if (payload?.rooms) {
          state.rooms = payload.rooms;
          state.listPage = payload.page ?? state.listPage;
          state.listLimit = payload.limit ?? state.listLimit;
          state.listTotalPages = payload.totalPages ?? state.listTotalPages;
          state.listTotalItems = payload.totalItems ?? state.listTotalItems;
        } else if (Array.isArray(payload)) {
          state.rooms = payload;
          state.listPage = 1;
          state.listLimit = payload.length;
          state.listTotalPages = 1;
          state.listTotalItems = payload.length;
        } else {
          state.rooms = payload;
        }
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

export const selectRoomsPage = (state) => state.rooms.listPage;
export const selectRoomsLimit = (state) => state.rooms.listLimit;
export const selectRoomsTotalPages = (state) => state.rooms.listTotalPages;
export const selectRoomsTotalItems = (state) => state.rooms.listTotalItems;

export default roomsSlice.reducer;
