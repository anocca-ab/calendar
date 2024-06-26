import { Typography, styled } from "@mui/material";
import { addMinutes } from "date-fns";
import { CalendarEvent } from "../types";

export const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
}));

export function doEventsOverlap(event1: CalendarEvent, event2: CalendarEvent) {
  const end1 = event1.end ?? addMinutes(event1.start, 15);
  const end2 = event2.end ?? addMinutes(event2.start, 15);
  return end1 > event2.start && event1.start < end2;
}

export function groupNonOverlappingEvents(
  events: {
    left: number;
    top: number;
    duration: number;
    event: CalendarEvent;
  }[]
) {
  const groups: {
    left: number;
    top: number;
    duration: number;
    event: CalendarEvent;
  }[][] = [];

  events.forEach((event) => {
    let placed = false;

    // Try to place the event in an existing group
    for (let group of groups) {
      // Check if the event overlaps with any event in the group
      if (
        !group.some((groupEvent) =>
          doEventsOverlap(groupEvent.event, event.event)
        )
      ) {
        group.push(event);
        placed = true;
        break;
      }
    }

    // If the event couldn't be placed in any existing group, create a new group
    if (!placed) {
      groups.push([event]);
    }
  });

  return groups;
}

export function widthToPct(width: number, daysInWeek: number): string {
  return String((width / (120 * daysInWeek)) * 100) + "%";
}
