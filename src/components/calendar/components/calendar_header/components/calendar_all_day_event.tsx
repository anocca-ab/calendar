import { CalendarEvent as CalendarEventType } from "@/types";
import { Box, SxProps, Theme } from "@mui/material";
import { differenceInMinutes } from "date-fns";
import {
  EventTypography,
  mergeSx,
  variationsToColorRecord,
} from "../../../helpers";

export function CalendarAllDayEvent({
  title = "(No title)",
  start,
  end,
  color = "pink",
  sx,
}: CalendarEventType & {
  sx?: SxProps<Theme>;
}) {
  if (!end) {
    throw new Error("A full day event must have an end date!");
  }
  const eventDurationInMins = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });

  const eventDurationInHours = Math.floor(eventDurationInMins / 60);
  const eventDurationInDays = Math.floor(eventDurationInHours / 24);

  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: variationsToColorRecord[color],
          display: "flex",
          padding: "0px 8px",
          height: "16px",
          borderRadius: "4px",
          // width:
          //   eventDurationInDays > 1
          //     ? `${eventDurationInDays * 120 - 10}px`
          //     : "110px",
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
