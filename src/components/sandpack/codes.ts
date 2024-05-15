export const AppTsx = `
import { Box, ScopedCssBaseline } from "@mui/material"
import { WeekCalendar } from "@anocca/calendar";
import { eventsFixture } from './fixtures.tsx';

export default function App () {
  return (
    <ScopedCssBaseline>
      <Box width="100%" height="100%" display="flex" p={4}>
        <WeekCalendar
          events={eventsFixture}
          onEditEvent={(oldEvent, newEvent) => {}}
          onCreateEvent={(newEvent) => {}}
          onMoveEvent={(oldEvent, newEvent) => {}}
        />
      </Box>
    </ScopedCssBaseline>
  );
}
`;

export const FixturesTsx = `
import type { CalendarEvent } from "@anocca/calendar";
import {  addDays, addMinutes } from "@anocca/calendar";


export const eventsFixture: {
  allDayEvents: CalendarEvent[];
  gridEvents: CalendarEvent[];
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

`;
