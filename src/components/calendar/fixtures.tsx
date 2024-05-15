import { Box } from "@mui/material";
import { addDays, addMinutes } from "date-fns";
import type { CalendarEvent as CalendarEventType } from "./types";
import { CalendarEvent } from "./components/calendar_body/components/calendar_event";

export function renderFixtureEvents(numberOfEvents: number, variant: string) {
  const events: React.JSX.Element[] = [];

  for (let i = 1; i <= numberOfEvents; i++) {
    events.push(
      <Box height={i * 15 + 2}>
        <CalendarEvent
          key={i + variant}
          color={variant}
          title="event"
          start={new Date()}
          end={addMinutes(new Date(), i * 15)}
        />
      </Box>,
    );
  }

  return events;
}

export const eventsFixture: CalendarEventType[] = [
  {
    id: "1",
    title: "event",
    start: new Date(),
    color: "pink",
  },
  {
    title: "event",
    start: new Date(),
    end: addDays(new Date(), 1),
    color: "pink",
  },
  {
    title: "event",
    start: new Date(),
    end: addDays(new Date(), 2),
    color: "pink",
  },
  {
    title: "event",
    start: new Date(),
    end: addDays(new Date(), 4),
    color: "red",
  },
  {
    title: "event",
    start: new Date(),
    end: addMinutes(new Date(), 10),
    color: "orange",
  },
  {
    title: "event",
    start: new Date(),
    end: addMinutes(new Date(), 15),
    color: "red",
  },
  {
    title: "event",
    start: new Date(),
    end: addMinutes(new Date(), 36),
    color: "teal",
  },
  {
    title: "event",
    start: new Date(),
    end: addMinutes(new Date(), 120),
    color: "pink",
  },
  {
    title: "event",
    start: new Date(),
    end: addMinutes(new Date(), 181),
    color: "indigo",
  },
];
