import { addWeeks, areIntervalsOverlapping } from "date-fns";
import { CalendarEvent } from "../types";
import { Typography, styled } from "@mui/material";

export const variationsToColorRecord: Record<string, string> = {
  orange: "#FF7043",
  indigo: "#5C6BC0",
  pink: "#EC407A",
  teal: "#26A69A",
  red: "#EF5350",
};

export function filterWeekEvents(
  events: CalendarEvent[],
  currentFirstDayOfTheWeek: Date,
) {
  const filteredEvents: CalendarEvent[] = [];
  events.forEach((event) => {
    const doesWeekOverlapWithEvent = areIntervalsOverlapping(
      {
        start: currentFirstDayOfTheWeek,
        end: addWeeks(currentFirstDayOfTheWeek, 1),
      },
      { start: event.start, end: event.end! },
    );
    if (doesWeekOverlapWithEvent) {
      filteredEvents.push(event);
    }
  });
  return filteredEvents;
}

export const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
}));
