import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexRow } from "../wrappers";
import { WeekCalendarGrid } from "./components/week_calendar_grid";
import { WeekCalendarGridAmPmSidebar } from "./components/week_calendar_grid_am_pm_sidebar";

export function WeekCalendarBody({
  gridEvents,
}: {
  gridEvents: CalendarEventType[];
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <WeekCalendarGridAmPmSidebar />
      <WeekCalendarGrid events={gridEvents} />
    </FlexRow>
  );
}
