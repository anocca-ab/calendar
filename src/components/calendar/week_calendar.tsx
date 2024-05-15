import { FlexCol } from "./components/wrappers";
import { CalendarGrid } from "./components/calendar_grid/calendar_grid";
import { CalendarHeader } from "./components/calendar_header/calendar_header";
import { WeekCalendarProps } from "./types";

export function WeekCalendar(props: WeekCalendarProps) {
  const { events } = props;
  return (
    // the height should be 832px but is being removed because messes with the live editor
    <FlexCol width="664px">
      <CalendarHeader allDayEvents={events.allDayEvents} />
      <CalendarGrid gridEvents={events.gridEvents} />
    </FlexCol>
  );
}
