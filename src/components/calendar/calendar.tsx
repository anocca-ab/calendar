import { Box, ScopedCssBaseline } from "@mui/material";
import { startOfWeek } from "date-fns";
import { WeekCalendarProvider } from "./state_management/week_calendar_context";
import {
  CalendarEvent,
  OnChangeEventTime,
  OnSelectEvent,
  StartDay,
} from "./types";
import { WeekCalendarWrapper } from "./components/week_calendar";

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
