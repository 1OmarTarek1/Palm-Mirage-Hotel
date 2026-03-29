import axiosInstance from './axiosInstance';

// Define all your API calls in one place
const menuApi = {
  // Get all menu items
  getAllMenuItems: async () => {
    const response = await axiosInstance.get('/menu');
    return response.data;
  },

  // Get a single menu item by ID
  getMenuItemById: async (id) => {
    const response = await axiosInstance.get(`/menu/${id}`);
    return response.data;
  },

  // Add a new menu item
  addMenuItem: async (menuItemData) => {
    const response = await axiosInstance.post('/menu', menuItemData);
    return response.data;
  },

  // Update an existing menu item
  updateMenuItem: async (id, updatedData) => {
    const response = await axiosInstance.patch(`/menu/${id}`, updatedData);
    return response.data;
  },

  // Delete a menu item
  deleteMenuItem: async (id) => {
    const response = await axiosInstance.delete(`/menu/${id}`);
    return response.data;
  },

  // Add more methods here if needed, for instance, filtering by category
  getMenuItemsByCategory: async (category) => {
    const response = await axiosInstance.get(`/menu?category=${category}`);
    return response.data;
  }
};

export default menuApi;
