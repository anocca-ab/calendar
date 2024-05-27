import { Box, ScopedCssBaseline } from "@mui/material";
import { startOfWeek } from "date-fns";
import { CalendarProvider } from "./state_management/calendar_context";
import {
  CalendarEvent,
  OnChangeEventTime,
  OnSelectEvent,
  StartDay,
} from "./types";
import { WeekCalendarWrapper } from "./components/week_calendar";
import { StackedWeekCalendarsWrapper } from "./components/stacked_week_calendars";

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
  variant?: "week" | "week-stacked" | "month";
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
          <CalendarProvider
            initialState={{
              workWeek,
              startDay,
              today,
              currentFirstDayOfTheWeek: startOfWeek(today, {
                weekStartsOn: startDay === "monday" ? 1 : 0,
              }),
            }}
          >
            {variant === "week" ? (
              <WeekCalendarWrapper events={events} />
            ) : (
              <StackedWeekCalendarsWrapper events={events} />
            )}
          </CalendarProvider>
        </ScopedCssBaseline>
      </Box>
    </>
  );
}
