import { FlexCol } from "@site/src/components/calendar/wrappers";
import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { CalendarWeekViewBar } from "./components/calendar_week_view_bar";
import { CalendarFullDayEventBar } from "./components/calendar_full_day_event_bar";

export function CalendarHeader() {
  return (
    <FlexCol>
      <CalendarLayoutBar />
      <CalendarWeekViewBar />
      <CalendarFullDayEventBar eventHeight={2} />
    </FlexCol>
  );
}
