import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectTimestamp = createSelector(
  (state: RootState) => state.clock.timestamp,
  (timestamp) => timestamp
);
