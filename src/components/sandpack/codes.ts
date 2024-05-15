export const AppTsx = `
import { Box } from "@mui/material"
import { WeekCalendar } from "@anocca/calendar";
import { eventsFixture } from './fixtures.tsx';

export default function App () {
  return (
    <Box p={4}>
      <WeekCalendar events={eventsFixture} />
    </Box>
  );
}
`;

export const FixturesTsx = `
import type { CalendarEvent } from "@anocca/calendar";
import { addDays, addMinutes } from "date-fns";

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

`;
