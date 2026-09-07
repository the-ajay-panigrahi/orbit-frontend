import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    appendFeed: (state, action) => {
      if (!state) return action.payload;
      const existingIds = new Set(state.map((user) => user._id));
      const newUsers = action.payload.filter(
        (user) => !existingIds.has(user._id),
      );
      return [...state, ...newUsers];
    },
    removeFeed: () => {
      return null;
    },
    removeUserFromFeed: (state, action) => {
      if (!state) return null;
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { addFeed, appendFeed, removeFeed, removeUserFromFeed } =
  feedSlice.actions;
export default feedSlice.reducer;
