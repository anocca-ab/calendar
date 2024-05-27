import { FlexCol } from "../wrappers";
import { CalendarLayoutBar } from "./components/calendar_layout_bar";
import { CalendarMonthViewBar } from "./components/calendar_month_view_bar";

export function MonthCalendarHeader() {
  return (
    <FlexCol width="100%">
      <CalendarLayoutBar />
      <CalendarMonthViewBar />
    </FlexCol>
  );
}
