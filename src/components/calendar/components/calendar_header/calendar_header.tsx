import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { CalendarWeekViewBar } from "./components/calendar_week_view_bar";
import { CalendarFullDayEventBar } from "./components/calendar_full_day_event_bar";
import type { CalendarEvent, StartDay } from "../../types";
import { FlexCol } from "../wrappers";

export function CalendarHeader({
  allDayEvents,
  today,
  workWeek,
  startDay,
}: {
  allDayEvents: CalendarEvent[];
  today: Date;
  workWeek: boolean;
  startDay: StartDay;
}) {
  return (
    <FlexCol width="664px">
      <CalendarLayoutBar today={today} />
      <CalendarWeekViewBar
        today={today}
        workWeek={workWeek}
        startDay={startDay}
      />
      <CalendarFullDayEventBar eventHeight={2} events={allDayEvents} />
    </FlexCol>
  );
}
