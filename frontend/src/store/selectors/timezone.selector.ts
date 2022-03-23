import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectTimezone = createSelector(
  (state: RootState) => state.clock.timezone,
  (timezone) => timezone
);
