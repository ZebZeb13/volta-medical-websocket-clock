import { configureStore } from "@reduxjs/toolkit";
import { clockSlice } from "./clock.slice";

export const store = configureStore({
  reducer: {
    [clockSlice.name]: clockSlice.reducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
