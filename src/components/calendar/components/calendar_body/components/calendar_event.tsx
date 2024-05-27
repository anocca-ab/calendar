import { Box, SxProps, Theme } from "@mui/material";
import { EventTypography, formatDuration } from "../../../helpers";
import type { CalendarEvent } from "../../../types";

export function CalendarEvent({
  title = "(No title)",
  start,
  end,
  sx,
}: Omit<CalendarEvent, "color"> & {
  sx?: SxProps<Theme>;
}) {
  const formattedDuration = formatDuration(start, end);

  return (
    <Box sx={sx}>
      <Box>
        <EventTypography>{title}</EventTypography>
      </Box>

      <Box>
        <EventTypography>{formattedDuration}</EventTypography>
      </Box>
    </Box>
  );
}
