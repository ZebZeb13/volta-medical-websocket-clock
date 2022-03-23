import React, { memo } from "react";
import { ReadyState } from "react-use-websocket";
import { Chip, ChipProps, Stack, Typography } from "@mui/material";

const getConnectionStatusColor = (status: ReadyState): ChipProps["color"] => {
  switch (status) {
    case ReadyState.OPEN:
      return "success";

    case ReadyState.CLOSED:
      return "error";

    default:
      return undefined;
  }
};

const getConnectionStatusLabel = (status: ReadyState): string => {
  switch (status) {
    case ReadyState.CONNECTING:
      return "Connecting";
    case ReadyState.OPEN:
      return "Open";
    case ReadyState.CLOSING:
      return "Closing";
    case ReadyState.CLOSED:
      return "Closed";
    case ReadyState.UNINSTANTIATED:
      return "Uninstantiated";
    default:
      return "unknown";
  }
};

interface ConnectionStateProps {
  state: ReadyState;
}

export const ConnectionState = memo((props: ConnectionStateProps) => {
  const { state } = props;
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      <Typography variant="caption">The WebSocket is currently </Typography>
      <Chip color={getConnectionStatusColor(state)} label={getConnectionStatusLabel(state)} />
    </Stack>
  );
});
