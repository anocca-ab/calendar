import { ScopedCssBaseline } from "@mui/material";
import { CalendarBody } from "./components/calendar_body/calendar_body";
import { CalendarHeader } from "./components/calendar_header/calendar_header";
import { FlexCol } from "./components/wrappers";
import { WeekCalendarProps } from "./types";

export function WeekCalendar(props: WeekCalendarProps) {
  const { events } = props;
  return (
    // the height should be 832px but is being removed because messes with the live editor
    <ScopedCssBaseline>
      <FlexCol width="664px">
        <CalendarHeader allDayEvents={events.allDayEvents} />
        <CalendarBody gridEvents={events.gridEvents} />
      </FlexCol>
    </ScopedCssBaseline>
  );
}
