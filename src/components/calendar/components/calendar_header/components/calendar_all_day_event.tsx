import { Box, SxProps, Theme } from "@mui/material";
import { differenceInMinutes } from "date-fns";
import { mergeSx } from "../../../helpers";
import {
  EventTypography,
  variationsToColorRecord,
} from "../../calendar_body/components/calendar_event";
import { CalendarEvent as CalendarEventType } from "@/types";

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
  const minutes = differenceInMinutes(end, start, {
    roundingMethod: "floor",
  });

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return (
    <Box
      sx={mergeSx(
        {
          backgroundColor: variationsToColorRecord[color],
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
        <EventTypography>{title}</EventTypography>
      </Box>
    </Box>
  );
}
