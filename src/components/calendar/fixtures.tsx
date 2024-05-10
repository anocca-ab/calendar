import { HourCalendarCell } from "./components/calendar_grid/components/hour_calendar_cell";
import {
  CalendarVariant,
  CalendarEvent,
} from "./components/calendar_grid/components/calendar_event";
import { addMinutes } from "./helpers";
import { Box } from "@mui/material";

export function renderFixtureEvents(
  numberOfEvents: number,
  variant: CalendarVariant,
) {
  const events: React.JSX.Element[] = [];

  for (let i = 1; i <= numberOfEvents; i++) {
    events.push(
      <Box height={i * 15 + 2}>
        <CalendarEvent
          key={i + variant}
          variant={variant}
          title="event"
          startTime={new Date()}
          endTime={addMinutes(new Date(), i * 15)}
        />
      </Box>,
    );
  }

  return events;
}

export const eventsFixture = [
  <HourCalendarCell key="orange">
    <CalendarEvent
      variant="orange"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 10)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="red">
    <CalendarEvent
      variant="red"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 15)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="teal">
    <CalendarEvent
      variant="teal"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 36)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="pink">
    <CalendarEvent
      variant="pink"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 120)}
    />
  </HourCalendarCell>,
  <HourCalendarCell key="indigo">
    <CalendarEvent
      variant="indigo"
      title="event"
      startTime={new Date()}
      endTime={addMinutes(new Date(), 181)}
    />
  </HourCalendarCell>,
];
