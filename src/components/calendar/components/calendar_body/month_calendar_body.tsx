import type { CalendarEvent as CalendarEventType } from "../../types";
import { FlexRow } from "../wrappers";
import { MonthCalendarGrid } from "./components/month_calendar_grid";
import { WeekIndicator } from "./components/week_indicator";

export function MonthCalendarBody({
  gridEvents,
  allDayEvents,
  calendarTitle,
  color = "teal",
}: {
  gridEvents: CalendarEventType[];
  allDayEvents: CalendarEventType[];
  calendarTitle: string;
  color?: string;
}) {
  return (
    <FlexRow
      sx={{
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <WeekIndicator title={calendarTitle} color={color} />
      <MonthCalendarGrid gridEvents={gridEvents} allDayEvents={allDayEvents} />
    </FlexRow>
  );
}
