import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuApi from '../../services/menuApi';

// ==============================
// Async Thunks
// ==============================

// Fetch all menu items
export const fetchMenuItems = createAsyncThunk(
  'menu/fetchMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      // This calls the GET /menu endpoint through your custom axiosInstance
      const data = await menuApi.getAllMenuItems();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menu items'
      );
    }
  }
);

// Add a new menu item
export const addMenuItem = createAsyncThunk(
  'menu/addMenuItem',
  async (newMenuData, { rejectWithValue }) => {
    try {
      const data = await menuApi.addMenuItem(newMenuData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add menu item'
      );
    }
  }
);

// ==============================
// Slice Setup
// ==============================

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // Add synchronous actions here if needed
    clearMenuErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -----------------------------
      // fetchMenuItems handlers
      // -----------------------------
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure to map correctly depending on your API structure.
        // e.g. action.payload.data if the array sits inside a data object
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // -----------------------------
      // addMenuItem handlers
      // -----------------------------
      .addCase(addMenuItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.loading = false;
        // Append the newly created item to the items list
        state.items.push(action.payload);
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMenuErrors } = menuSlice.actions;

export default menuSlice.reducer;
