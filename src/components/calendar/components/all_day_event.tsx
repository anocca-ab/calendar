import { Box, SxProps, Theme } from "@mui/material";
import { mergeSx } from "../helpers";
import {
  CalendarVariant,
  EventTypography,
  variationsToColorRecord,
} from "./event";

export function AllDayEvent({
  title,
  startTime,
  endTime,
  variant = "orange",
  sx,
}: {
  title: string;
  startTime: Date;
  endTime: Date;
  variant?: CalendarVariant;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: variationsToColorRecord[variant],
          display: "flex",
          padding: "0px 8px",
          height: "16px",
          borderRadius: "4px",
        },
        sx,
      )}
    >
      <Box>
        <EventTypography>aa</EventTypography>
      </Box>

      <EventTypography>aa</EventTypography>
    </Box>
  );
}
