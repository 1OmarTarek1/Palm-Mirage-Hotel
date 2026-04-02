import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../services/axiosInstance';

// ============================================================
//                      MENU THUNKS
// ============================================================

/**
 * @desc  Fetch all menu items
 *        GET /api/menu
 */
export const fetchAllMenuItems = createAsyncThunk(
  'menu/fetchAllMenuItems',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/menu');
      return data.data.menuItems;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load menu'
      );
    }
  }
);

/**
 * @desc  Fetch menu items by category
 *        GET /api/menu?category=:category
 */
export const fetchMenuByCategory = createAsyncThunk(
  'menu/fetchMenuByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get('/menu', {
        params: { category },
      });
      return data.data.menuItems;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load menu category'
      );
    }
  }
);

/**
 * @desc  Fetch a single menu item by id
 *        GET /api/menu/:id
 */
export const fetchMenuItemById = createAsyncThunk(
  'menu/fetchMenuItemById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/menu/${id}`);
      return data.data.menuItem;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Menu item not found'
      );
    }
  }
);

// ============================================================
//                      MENU SLICE
// ============================================================

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    // ── All menu items list ────────────────────────────────
    menuItems:    [],
    listLoading:  false,
    listError:    null,

    // ── Active category filter ─────────────────────────────
    activeCategory: 'all',

    // ── Single menu item details ───────────────────────────
    menuItem:        null,
    menuItemLoading: false,
    menuItemError:   null,
  },

  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    clearMenuItem(state) {
      state.menuItem      = null;
      state.menuItemError = null;
    },
  },

  extraReducers: (builder) => {
    // ── fetchAllMenuItems ──────────────────────────────────
    builder
      .addCase(fetchAllMenuItems.pending, (state) => {
        state.listLoading = true;
        state.listError   = null;
      })
      .addCase(fetchAllMenuItems.fulfilled, (state, action) => {
        state.listLoading = false;
        state.menuItems   = action.payload;
      })
      .addCase(fetchAllMenuItems.rejected, (state, action) => {
        state.listLoading = false;
        state.listError   = action.payload;
      });

    // ── fetchMenuByCategory ────────────────────────────────
    builder
      .addCase(fetchMenuByCategory.pending, (state) => {
        state.listLoading = true;
        state.listError   = null;
      })
      .addCase(fetchMenuByCategory.fulfilled, (state, action) => {
        state.listLoading = false;
        state.menuItems   = action.payload;
      })
      .addCase(fetchMenuByCategory.rejected, (state, action) => {
        state.listLoading = false;
        state.listError   = action.payload;
      });

    // ── fetchMenuItemById ──────────────────────────────────
    builder
      .addCase(fetchMenuItemById.pending, (state) => {
        state.menuItemLoading = true;
        state.menuItemError   = null;
        state.menuItem        = null;
      })
      .addCase(fetchMenuItemById.fulfilled, (state, action) => {
        state.menuItemLoading = false;
        state.menuItem        = action.payload;
      })
      .addCase(fetchMenuItemById.rejected, (state, action) => {
        state.menuItemLoading = false;
        state.menuItemError   = action.payload;
      });
  },
});

export const { setActiveCategory, clearMenuItem } = menuSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectMenuItems       = (state) => state.menu.menuItems;
export const selectListLoading     = (state) => state.menu.listLoading;
export const selectListError       = (state) => state.menu.listError;
export const selectActiveCategory  = (state) => state.menu.activeCategory;
export const selectMenuItem        = (state) => state.menu.menuItem;
export const selectMenuItemLoading = (state) => state.menu.menuItemLoading;
export const selectMenuItemError   = (state) => state.menu.menuItemError;

export default menuSlice.reducer;