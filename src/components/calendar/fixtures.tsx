import { addDays, addMinutes } from "./helpers";
import { Box } from "@mui/material";
import { CalendarEvent } from "./components/calendar_body/components/calendar_event";
import type {
  CalendarEvent as CalendarEventType,
  CalendarVariant,
} from "./types";

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

export const eventsFixture: {
  allDayEvents: CalendarEventType[];
  gridEvents: CalendarEventType[];
} = {
  allDayEvents: [
    {
      title: "event",
      startTime: new Date(),
      endTime: addDays(new Date(), 4),
      variant: "pink",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addDays(new Date(), 2),
      variant: "pink",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addDays(new Date(), 1),
      variant: "red",
    },
  ],
  gridEvents: [
    {
      title: "event",
      startTime: new Date(),
      endTime: addMinutes(new Date(), 10),
      variant: "orange",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addMinutes(new Date(), 15),
      variant: "red",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addMinutes(new Date(), 36),
      variant: "teal",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addMinutes(new Date(), 120),
      variant: "pink",
    },
    {
      title: "event",
      startTime: new Date(),
      endTime: addMinutes(new Date(), 181),
      variant: "indigo",
    },
  ],
};
