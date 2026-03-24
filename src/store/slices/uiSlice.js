import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  animations: [],
  counters: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addAnimation: (state, action) => {
      state.animations.push(action.payload);
    },
    removeAnimation: (state, action) => {
      state.animations = state.animations.filter(
        (anim) => anim.id !== action.payload
      );
    },
  },
});

export const { addAnimation, removeAnimation } = uiSlice.actions;
export const selectAnimations = (state) => state.ui.animations;

export default uiSlice.reducer;
