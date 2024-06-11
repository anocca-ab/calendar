import { CalendarEvent } from "../types";
import { FlexRow } from "../wrappers";
import { MonthCalendarWeekGrid } from "./month_calendar_week_grid";
import { WeekIndicator } from "./week_indicator";

export function MonthCalendarWeekBody({
  weekEvents,
  calendarTitle,
  weekNumber,
  color = "teal",
}: {
  weekEvents: Record<
    string,
    {
      gridEvents: CalendarEvent[];
      allDayEvents: CalendarEvent[];
    }
  >;
  calendarTitle: string;
  weekNumber: number;
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
      <MonthCalendarWeekGrid weekEvents={weekEvents} weekNumber={weekNumber} />
    </FlexRow>
  );
}
