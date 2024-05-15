import { Box, ScopedCssBaseline } from "@mui/material";
import { CalendarBody } from "./components/calendar_body/calendar_body";
import { CalendarHeader } from "./components/calendar_header/calendar_header";
import { FlexCol } from "./components/wrappers";
import { CalendarEvent, OnChangeEventTime, OnSelectEvent, StartDay } from "./types";

export function WeekCalendar({
  // defaults
  workWeek = false,
  startDay = 'monday',
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
    // the height should be 832px but is being removed because messes with the live editor
    <>
      <Box
        sx={{
          "*": {
            all: "revert-layer",
          },
        }}
      >
        <ScopedCssBaseline>
          <FlexCol width="664px">
            <CalendarHeader allDayEvents={allDayEvents} />
            <CalendarBody gridEvents={gridEvents} />
          </FlexCol>
        </ScopedCssBaseline>
      </Box>
    </>
  );
}
