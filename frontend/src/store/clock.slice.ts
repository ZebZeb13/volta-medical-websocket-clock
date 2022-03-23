import {
  createEntityAdapter,
  createSlice,
  EntityId,
  EntityState,
  PayloadAction
} from "@reduxjs/toolkit";
import type { Alarm } from "../model/Alarm";
import { Timezone } from "../model/Timezone";

export const selectAlarmEntityId = (alarm: Alarm) => `${alarm.label}-${alarm.timestamp}`;

export const alarmsEntityAdapter = createEntityAdapter<Alarm>({
  selectId: selectAlarmEntityId
});

export interface ClockState {
  alarms: EntityState<Alarm>;
  timestamp: number;
  timezone: Timezone;
}

const initialState: ClockState = {
  alarms: alarmsEntityAdapter.getInitialState(),
  timestamp: 0,
  timezone: {
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: -new Date().getTimezoneOffset() / 60
  }
};

export const clockSlice = createSlice({
  name: "clock",
  initialState,
  reducers: {
    addAlarm: (state, action: PayloadAction<Alarm>) => {
      state.alarms = alarmsEntityAdapter.addOne(state.alarms, action.payload);
    },
    removeAlarm: (state, action: PayloadAction<EntityId>) => {
      state.alarms = alarmsEntityAdapter.removeOne(state.alarms, action.payload);
    },
    setTimestamp: (state, action: PayloadAction<number>) => {
      state.timestamp = action.payload;
    },
    setTimezone: (state, action: PayloadAction<Timezone>) => {
      state.timezone = action.payload;
    }
  }
});

export const clockActions = clockSlice.actions;
