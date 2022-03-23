import React, { memo } from "react";
import { Typography } from "@mui/material";
import { format } from "date-fns";

interface DigitalClockProps {
  value: Date;
}

export const DigitalClock = memo((props: DigitalClockProps) => {
  const { value } = props;

  const formattedDate = format(value, "HH:mm:ss");
  return <Typography variant="h2">{formattedDate}</Typography>;
});
