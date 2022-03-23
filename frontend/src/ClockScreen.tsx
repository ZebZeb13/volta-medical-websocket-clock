import React, { memo, useCallback, useMemo } from "react";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { DigitalClock } from "./components/clock/DigitalClock";
import { Stack } from "@mui/material";
import TimezoneSelect, { ITimezoneOption } from "react-timezone-select";
import { zonedTimeToUtc } from "date-fns-tz";
import { AlarmsDialog } from "./components/alarm/AlarmsDialog";
import { AddAlarmForm } from "./components/alarm/AddAlarmForm";
import type { Alarm } from "./model/Alarm";
import styled from "styled-components";
import { batch, useDispatch, useSelector } from "react-redux";
import { selectTimestamp } from "./store/selectors/timestamp.selector";
import { selectAlarms } from "./store/selectors/alarms.selector";
import { clockActions, selectAlarmEntityId } from "./store/clock.slice";
import { selectTimezone } from "./store/selectors/timezone.selector";

const TimezoneSelectFullWidth = styled(TimezoneSelect)`
  width: 100%;
`;

interface ClockScreenProps {
  sendMessage: (topic: string, payload: Record<string, unknown>) => void;
}

export const ClockScreen = memo((props: ClockScreenProps) => {
  const { sendMessage } = props;

  const dispatch = useDispatch();

  const timestamp = useSelector(selectTimestamp);
  const timezone = useSelector(selectTimezone);
  const alarms = useSelector(selectAlarms);

  const handleCloseDialog = useCallback(() => {
    batch(() => {
      alarms.forEach((alarm) => dispatch(clockActions.removeAlarm(selectAlarmEntityId(alarm))));
    });
  }, [alarms, sendMessage]);

  const sendAlarms = useCallback(
    (newAlarm: Alarm & { timezoneOffset: number }) => {
      const data = {
        alarm: newAlarm
      };
      sendMessage("alarm", data);
    },
    [sendMessage]
  );

  const handleChangeTimezone = (newTimezone: ITimezoneOption) => {
    dispatch(
      clockActions.setTimezone({
        value: newTimezone.value,
        offset: newTimezone.offset ?? 0
      })
    );
  };

  const date = useMemo(
    () => zonedTimeToUtc(new Date(timestamp * 1000), timezone.value),
    [timestamp, timezone]
  );

  return (
    <>
      <TimezoneSelectFullWidth value={timezone.value} onChange={handleChangeTimezone} />

      {date && (
        <Stack alignItems="center" gap={1}>
          <Clock value={date} size={300} />
          <DigitalClock value={date} />
        </Stack>
      )}

      <AddAlarmForm timezone={timezone} onAdd={sendAlarms} />
      <AlarmsDialog alarms={alarms} timezone={timezone} onClose={handleCloseDialog} />
    </>
  );
});
