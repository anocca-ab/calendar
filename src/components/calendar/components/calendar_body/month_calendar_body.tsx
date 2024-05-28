import { Box } from "@mui/material";
import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexRow } from "../wrappers";
import { MonthCalendarGrid } from "./components/month_calendar_grid";

export function MonthCalendarBody({
  gridEvents,
  allDayEvents,
}: {
  gridEvents: CalendarEventType[];
  allDayEvents: CalendarEventType[];
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <Box width="20px" />
      <MonthCalendarGrid gridEvents={gridEvents} allDayEvents={allDayEvents} />
    </FlexRow>
  );
}
