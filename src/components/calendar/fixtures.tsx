import { Box } from "@mui/material";
import { addDays, addMinutes, subHours, subMinutes } from "date-fns";
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
    // data: { id: "1" },
    title: "Task",
    start: subMinutes(new Date(), 30),
    color: "pink",
  },
  {
    title: "Full day event",
    start: new Date(),
    end: addDays(new Date(), 1),
    color: "pink",
  },
  {
    title: "2 days event",
    start: new Date(),
    end: addDays(new Date(), 2),
    color: "pink",
  },
  {
    title: "4 days event",
    start: new Date(),
    end: addDays(new Date(), 4),
    color: "red",
  },
  {
    // title: "10min event",
    start: subHours(new Date(), 3),
    end: addMinutes(subHours(new Date(), 3), 10),
    color: "orange",
  },
  {
    title: "15min event",
    start: subHours(new Date(), 2),
    end: addMinutes(subHours(new Date(), 2), 10),
    color: "red",
  },
  {
    title: "36min event",
    start: addMinutes(new Date(), 15),
    end: addMinutes(addMinutes(new Date(), 15), 36),
    color: "teal",
  },
  {
    title: "2 hours event",
    start: new Date(),
    end: addMinutes(new Date(), 120),
    color: "pink",
  },
  {
    title: "3 hours event",
    start: new Date(),
    end: addMinutes(new Date(), 181),
    color: "indigo",
  },
];
