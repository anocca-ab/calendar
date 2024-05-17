import { EventTypography } from "../../../helpers";
import { Box, SxProps, Theme } from "@mui/material";
import { differenceInMinutes, format } from "date-fns";
import type { CalendarEvent as CalendarEventType } from "../../../types";

export function CalendarEvent({
  title = "(No title)",
  start,
  end,
  sx,
}: Omit<CalendarEventType, "color"> & {
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

/**
 * This function compiles and returns the title/duration information shown on the event component.
 *
 * @param start
 * @param end
 * @returns
 */
export function formatDuration(start: Date, end?: Date) {
  if (!end) {
    return format(start, "h:mm");
  }

  const eventDurationInMinutes = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });
  const eventDurationInHours = Math.floor(eventDurationInMinutes / 60);
  const eventDurationInDays = Math.floor(eventDurationInHours / 24);

  const updatedStart = format(start, "h:mmaaa");
  const updatedEnd = format(end, "h:mmaaa");

  const formattedDuration =
    eventDurationInDays >= 1
      ? ""
      : eventDurationInMinutes >= 30
        ? `${format(start, "h:mm")} - ${updatedEnd}`
        : updatedStart;

  return formattedDuration;
}
