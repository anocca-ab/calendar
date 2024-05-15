import { FlexCol } from "@site/src/components/calendar/components/wrappers";
import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { CalendarWeekViewBar } from "./components/calendar_week_view_bar";
import { CalendarFullDayEventBar } from "./components/calendar_full_day_event_bar";
import type { CalendarEvent } from "../../types";

export function CalendarHeader({
  allDayEvents,
}: {
  allDayEvents: CalendarEvent[];
}) {
  return (
    <FlexCol width="664px">
      <CalendarLayoutBar />
      <CalendarWeekViewBar />
      <CalendarFullDayEventBar eventHeight={2} events={allDayEvents} />
    </FlexCol>
  );
}
