export const AppTsx = `
import { Box } from "@mui/material"
import { Calendar } from "@anocca/calendar";
import { eventsFixture } from './fixtures.tsx';

export default function App () {
  return (
    <Box p={4}>
      <Calendar variant="week" events={eventsFixture} />
    </Box>
  );
}
`;

export const FixturesTsx = `
import type { CalendarEvent } from "@anocca/calendar";
import { addDays, addHours, addMinutes, subMinutes, subHours } from "date-fns";

export const eventsFixture: CalendarEventType[] =  [
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
  {
    title: "Overnight event",
    start: addHours(new Date(), 10),
    end: addHours(addHours(new Date(), 14), 8),
    color: "teal",
  },
];
`;
