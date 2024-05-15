import { Box, SxProps, Theme } from "@mui/material";
import { differenceInMinutes } from "date-fns";
import { mergeSx } from "../../../helpers";
import { CalendarVariant } from "../../../types";
import {
  EventTypography,
  variationsToColorRecord,
} from "../../calendar_grid/components/calendar_event";

export function CalendarAllDayEvent({
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
  const minutes = differenceInMinutes(endTime, startTime, {
    roundingMethod: "floor",
  });

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: variationsToColorRecord[variant],
          display: "flex",
          padding: "0px 8px",
          height: "16px",
          borderRadius: "4px",
          width: days > 1 ? `${days * 120 - 10}px` : "110px",
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
