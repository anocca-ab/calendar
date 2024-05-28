import { FlexCol } from "../wrappers";
import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { MonthCalendarViewBar } from "./components/month_calendar_view_bar";

export function MonthCalendarHeader() {
  return (
    <FlexCol width="100%">
      <CalendarLayoutBar />
      <MonthCalendarViewBar />
    </FlexCol>
  );
}
