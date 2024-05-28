import { Box } from "@mui/material";
import {
  addDays,
  addHours,
  addMinutes,
  startOfWeek,
  subHours,
  subMinutes,
} from "date-fns";
import { CalendarEvent } from "./components/calendar_body/components/calendar_event";
import { MonthCalendarEvent } from "./components/calendar_body/components/month_calendar_event";
import {
  calculateEventProperties,
  getEventsWithRange,
  partitionGridEventsOnRanges,
} from "./helpers";
import type { CalendarEvent as CalendarEventType } from "./types";

export function renderFixtureEvents(numberOfEvents: number, color: string) {
  const events: React.JSX.Element[] = [];

  for (let i = 1; i <= numberOfEvents; i++) {
    const eventsWithRange = getEventsWithRange(
      [
        {
          title: "event",
          start: new Date(),
          end: addMinutes(new Date(), i * 15),
          color,
        },
      ],
      startOfWeek(new Date(), {
        weekStartsOn: 1,
      }),
    );

    const groupsOfOverlappingEvents =
      partitionGridEventsOnRanges(eventsWithRange);

    events.push(
      <Box height={i * 15 + 2}>
        <CalendarEvent
          key={i + color}
          title="event"
          start={new Date()}
          end={addMinutes(new Date(), i * 15)}
          sx={calculateEventProperties(
            groupsOfOverlappingEvents[0][0].event.start,
            groupsOfOverlappingEvents[0][0].height,
            groupsOfOverlappingEvents[0][0].event.color ?? "orange",
            groupsOfOverlappingEvents[0][0].event.end,
          )}
        />
      </Box>,
    );
  }

  return events;
}

export function renderFixtureWeekEvents(
  state: "normal" | "hover" | "selected",
) {
  return [
    <MonthCalendarEvent
      key="red"
      title="event"
      start={new Date()}
      end={addMinutes(new Date(), 15)}
      color="red"
      state={state}
    />,
    <MonthCalendarEvent
      key="orange"
      title="event"
      start={new Date()}
      end={addMinutes(new Date(), 15)}
      color="orange"
      state={state}
    />,
    <MonthCalendarEvent
      key="indigo"
      title="event"
      start={new Date()}
      end={addMinutes(new Date(), 15)}
      color="indigo"
      state={state}
    />,
    <MonthCalendarEvent
      key="teal"
      title="event"
      start={new Date()}
      end={addMinutes(new Date(), 15)}
      color="teal"
      state={state}
    />,
    <MonthCalendarEvent
      key="pink"
      title="event"
      start={new Date()}
      end={addMinutes(new Date(), 15)}
      color="pink"
      state={state}
    />,
  ];
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
    start: addDays(new Date(), 2),
    end: addDays(addDays(new Date(), 2), 2),
    color: "pink",
  },
  {
    title: "4 days event",
    start: addDays(new Date(), 1),
    end: addDays(addDays(new Date(), 1), 4),
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
    start: addDays(new Date(), 2),
    end: addMinutes(addDays(new Date(), 2), 15),
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
  {
    title: "Overnight event",
    start: addHours(new Date(), 1),
    end: addHours(addHours(new Date(), 1), 22),
    color: "teal",
  },
];
