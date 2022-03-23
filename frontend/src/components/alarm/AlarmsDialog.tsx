import React, { memo } from "react";
import { Dialog, DialogContent, DialogActions, Button, Chip, Stack } from "@mui/material";
import { Alarm } from "../../model/Alarm";
import styled from "styled-components";
import { format } from "date-fns";
import { zonedTimeToUtc } from "date-fns-tz";
import { Timezone } from "../../model/Timezone";

const DialogStyled = styled(Dialog)`
  animation: blinkingBackground 1s infinite;

  @keyframes blinkingBackground {
    100% {
      background-color: red;
    }
  }
`;

interface AlarmsDialogProps {
  alarms: Alarm[];
  timezone: Timezone;
  onClose: () => void;
}

export const AlarmsDialog = memo((props: AlarmsDialogProps) => {
  const { alarms, timezone, onClose } = props;
  return (
    <DialogStyled open={!!alarms.length} onClose={() => null}>
      <DialogContent>
        <Stack gap={2}>
          {alarms.map(({ label, timestamp }, index) => {
            const date = zonedTimeToUtc(new Date(timestamp * 1000), timezone.value);
            return (
              <Chip
                key={`${label}-${timestamp}-${index}`}
                label={`${label}: ${format(date, "dd/MM/yyyy HH:mm:ss")}`}
              />
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>remove alarm(s)</Button>
      </DialogActions>
    </DialogStyled>
  );
});
