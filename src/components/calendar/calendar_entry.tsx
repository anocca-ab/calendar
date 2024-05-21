import { Box, ScopedCssBaseline, Typography } from "@mui/material";
import { FlexCol } from "./components/wrappers";
import { eventsFixture } from "./fixtures";
import {
  CalendarEvent,
  OnChangeEventTime,
  OnSelectEvent,
  StartDay,
} from "./types";
import { startOfWeek } from "date-fns";
import { WeekCalendarProvider } from "./state_management/week_calendar_context";
import { WeekCalendarWrapper } from "./week_calendar";

export function CalendarEntry() {
  return (
    <Box>
      <FlexCol width="100%" height="100%" p={4}>
        <Box>
          <Typography variant="h4">Many events</Typography>
          <Calendar variant="week" events={eventsFixture} />
        </Box>

        <Box>
          <Typography variant="h4">A task</Typography>
          <Calendar
            events={[
              {
                // id: "1",
                title: "event",
                start: new Date(),
                color: "pink",
              },
            ]}
          />
        </Box>

        <Box>
          <Typography variant="h4">Many events</Typography>
          <Calendar events={eventsFixture} />
        </Box>
      </FlexCol>
    </Box>
  );
}

export function Calendar({
  variant = "week",
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
  variant?: "week" | "month";
  workWeek?: boolean;
  startDay?: StartDay;
  today?: Date;
  onChangeEventTime?: OnChangeEventTime;
  onSelectEvent?: OnSelectEvent;
}) {
  return (
    <>
      <Box
        sx={{
          "*": {
            all: "revert-layer",
          },
        }}
      >
        <ScopedCssBaseline>
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
            <WeekCalendarWrapper events={events} />
          </WeekCalendarProvider>
        </ScopedCssBaseline>
      </Box>
    </>
  );
}
