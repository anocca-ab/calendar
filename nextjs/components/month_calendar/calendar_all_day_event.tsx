import type { CalendarEvent } from "../types";
import { Box, SxProps, Theme } from "@mui/material";
import { EventTypography, variationsToColorRecord } from "./helpers";
import { mergeSx } from "../week_calendar/helpers";

export function CalendarAllDayEvent({
  title = "(No title)",
  start,
  end,
  color = "pink",
  sx,
}: CalendarEvent & {
  sx?: SxProps<Theme>;
}) {
  if (!end) {
    throw new Error("A full day event must have an end date!");
  }

  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: variationsToColorRecord[color],
          display: "flex",
          padding: "0px 8px",
          height: "16px",
          borderRadius: "4px",
        },
        sx,
      )}
    >
      <Box>
        <EventTypography>{title}</EventTypography>
      </Box>
    </Box>
  );
}
