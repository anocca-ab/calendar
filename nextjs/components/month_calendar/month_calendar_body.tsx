import { CalendarEvent, StartDay } from "../types";
import { FlexRow } from "../wrappers";
import { MonthCalendarGrid } from "./month_calendar_grid";
import { WeekIndicator } from "./week_indicator";

export function MonthCalendarBody({
  gridEvents,
  allDayEvents,
  calendarTitle,
  color = "teal",
}: {
  gridEvents: CalendarEvent[];
  allDayEvents: CalendarEvent[];
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
