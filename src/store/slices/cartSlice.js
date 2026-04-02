import { createSlice } from "@reduxjs/toolkit";

const resolveCartItemImage = (item) => {
  if (typeof item?.image === "string" && item.image) return item.image;
  if (typeof item?.image?.secure_url === "string" && item.image.secure_url) {
    return item.image.secure_url;
  }
  if (typeof item?.image?.url === "string" && item.image.url) {
    return item.image.url;
  }

  const imageCollections = [
    item?.images,
    item?.roomImages,
    item?.room?.images,
    item?.room?.roomImages,
  ];

  for (const collection of imageCollections) {
    if (!Array.isArray(collection) || collection.length === 0) continue;

    const firstImage = collection[0];
    if (typeof firstImage === "string" && firstImage) return firstImage;
    if (typeof firstImage?.secure_url === "string" && firstImage.secure_url) {
      return firstImage.secure_url;
    }
    if (typeof firstImage?.url === "string" && firstImage.url) {
      return firstImage.url;
    }
  }

  return "";
};

const normalizeCartItem = (item) => {
  const image = resolveCartItemImage(item);
  const name = item?.name || item?.roomName || item?.title || "Item";
  const category = item?.category || item?.type || item?.roomType || "general";
  const rawId = item?.id || item?._id || item?.roomId || item?.room?._id;
  const id = rawId || `${name}-${category}-${image || "no-image"}`;
  const price = Number(item?.price || 0);
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const nights = Number(item?.nights || 0);

  return {
    ...item,
    id,
    name,
    category,
    image,
    price,
    quantity,
    nights,
  };
};

const mergeCartItems = (items) => {
  const mergedItems = [];

  items.forEach((rawItem) => {
    const item = normalizeCartItem(rawItem);
    const existing = mergedItems.find((entry) => entry.id === item.id);

    if (existing) {
      existing.quantity += item.quantity;
      if (!existing.image && item.image) existing.image = item.image;
      if (!existing.name && item.name) existing.name = item.name;
      if (!existing.category && item.category) existing.category = item.category;
      if (!existing.nights && item.nights) existing.nights = item.nights;
      if (!existing.price && item.price) existing.price = item.price;
    } else {
      mergedItems.push(item);
    }
  });

  return mergedItems;
};

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cartItems");
    if (serializedCart === null) {
      return [];
    }
    const parsedCart = JSON.parse(serializedCart);
    return Array.isArray(parsedCart) ? mergeCartItems(parsedCart) : [];
  } catch (err) {
    console.error("Could not load cart from local storage", err);
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    const serializedCart = JSON.stringify(items);
    localStorage.setItem("cartItems", serializedCart);
  } catch (err) {
    console.error("Could not save cart to local storage", err);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(), // [{ id, name, image, price, quantity, nights }]
    isOpen: false,   // sidebar open/closed
  },
  reducers: {
    openCart: (state) => { state.isOpen = true; },
    closeCart: (state) => { state.isOpen = false; },
    toggleCart: (state) => { state.isOpen = !state.isOpen; },

    addItem: (state, action) => {
      const incomingItem = normalizeCartItem(action.payload);
      const existing = state.items.find((i) => i.id === incomingItem.id);
      if (existing) {
        existing.quantity += incomingItem.quantity;
        if (!existing.image && incomingItem.image) existing.image = incomingItem.image;
        if (!existing.name && incomingItem.name) existing.name = incomingItem.name;
        if (!existing.category && incomingItem.category) existing.category = incomingItem.category;
        if (!existing.nights && incomingItem.nights) existing.nights = incomingItem.nights;
        if (!existing.price && incomingItem.price) existing.price = incomingItem.price;
      } else {
        state.items.push(incomingItem);
      }
      saveCartToStorage(state.items);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      saveCartToStorage(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        } else {
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { openCart, closeCart, toggleCart, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
