import type { CalendarEvent } from "../../types";
import { FlexCol } from "../wrappers";
import { CalendarFullDayEventBar } from "./components/calendar_full_day_event_bar";
import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { CalendarWeekViewBar } from "./components/calendar_week_view_bar";

export function WeekCalendarHeader({
  allDayEvents,
}: {
  allDayEvents: CalendarEvent[];
}) {
  return (
    <FlexCol width="100%">
      <CalendarLayoutBar />
      <CalendarWeekViewBar />
      <CalendarFullDayEventBar events={allDayEvents} />
    </FlexCol>
  );
}
