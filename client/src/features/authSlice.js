import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action) => {
      //   state.type = action.payload.type;
      state.data = action.payload;
    },
    edit: (state, action) => {
      const updated = action.payload;
      state.data = updated;
    },
    follow: (state, action) => {
      const updated = state.data;
      updated.user.following.push(action.payload);
      state.data = updated;
    },
    unfollow: (state, action) => {
      const updated = state.data;
      updated.user.following = updated.user.following.filter(
        (item) => item !== action.payload
      );
      state.data = updated;
    },
    profile: (state, action) => {
      state.data.user = action.payload;
    },
  },
});

export const { logIn, edit, follow, unfollow, profile } = authSlice.actions;

export default authSlice.reducer;
