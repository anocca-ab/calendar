import { Box, ScopedCssBaseline } from "@mui/material";
import { CalendarBody } from "./components/calendar_body/calendar_body";
import { CalendarHeader } from "./components/calendar_header/calendar_header";
import { FlexCol } from "./components/wrappers";
import {
  CalendarEvent,
  OnChangeEventTime,
  OnSelectEvent,
  StartDay,
} from "./types";
import { WeekCalendarProvider } from "./state_management/week_calendar_context";
import { startOfWeek } from "date-fns";

export function WeekCalendar({
  // defaults
  workWeek = false,
  startDay = "monday",
  today = new Date(),

  // eventListeners
  onSelectEvent,
  onChangeEventTime,

  // our events
  events,
}: {
  events: CalendarEvent[];
  workWeek?: boolean;
  startDay?: StartDay;
  today?: Date;
  onChangeEventTime?: OnChangeEventTime;
  onSelectEvent?: OnSelectEvent;
}) {
  const allDayEvents: CalendarEvent[] = [];
  const gridEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    if (
      event.start &&
      event.end &&
      (event.end.getTime() - event.start.getTime()) % (24 * 60 * 60 * 1000) ===
        0
    ) {
      allDayEvents.push(event);
    } else {
      gridEvents.push(event);
    }
  });

  return (
    <>
      <WeekCalendarProvider
        initialState={{
          workWeek,
          startDay,
          today,
          currentFirstDayOfTheWeek: startOfWeek(today, {
            weekStartsOn: startDay === "monday" ? 1 : 0,
          }),
        }}
      >
        <Box
          sx={{
            "*": {
              all: "revert-layer",
            },
          }}
        >
          <ScopedCssBaseline>
            <FlexCol width={workWeek ? "664px" : "904px"}>
              <CalendarHeader allDayEvents={allDayEvents} />
              <CalendarBody gridEvents={gridEvents} />
            </FlexCol>
          </ScopedCssBaseline>
        </Box>
      </WeekCalendarProvider>
    </>
  );
}
