import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    posts: (state, action) => {
      state.data = action.payload;
    },
    addpost: (state, action) => {
      state.data.unshift(action.payload);
    },
  },
});

export const { posts, addpost } = postSlice.actions;

export default postSlice.reducer;
