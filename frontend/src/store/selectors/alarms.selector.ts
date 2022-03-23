import { createSelector } from "@reduxjs/toolkit";
import { alarmsEntityAdapter } from "../clock.slice";
import { RootState } from "../store";

export const selectAlarms = createSelector(
  (state: RootState) => state.clock.alarms,
  (alarms) => alarmsEntityAdapter.getSelectors().selectAll(alarms)
);
