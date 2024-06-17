import { Typography, styled } from "@mui/material";
import {
  addMinutes,
  compareAsc,
  differenceInDays,
  getDay,
  getWeekOfMonth,
  getWeeksInMonth,
} from "date-fns";
import { isAllDayEvent } from "../helpers";
import { CalendarEvent, StartDay } from "../types";

export const variationsToColorRecord: Record<string, string> = {
  orange: "#FF7043",
  indigo: "#5C6BC0",
  pink: "#EC407A",
  teal: "#26A69A",
  red: "#EF5350",
};

export const EventTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 500,
  fontSize: "10px",
  lineHeight: "14px",
  textAlign: "center",
  whiteSpace: "nowrap",
}));

export function getEventsPerWeek(
  events: CalendarEvent[],
  startDay: StartDay,
  now: Date,
) {
  const calendarWeeksEvents: Record<
    string,
    {
      normalEvents: {
        left: number;
        top: number;
        duration: number;
        event: CalendarEvent;
      }[];
      allDayEvents: {
        left: number;
        top: number;
        duration: number;
        event: CalendarEvent;
      }[];
      multiDayEvents: {
        left: number;
        top: number;
        duration: number;
        event: CalendarEvent;
      }[];
    }
  > = {};
  const weekStartsOn = startDay === "monday" ? 1 : 0;
  const weeksOfMonth = getWeeksInMonth(now, {
    weekStartsOn,
  });

  // init the record with empty weeks & days
  [...Array(weeksOfMonth)].forEach((_, week) => {
    calendarWeeksEvents[`${week}`] = {
      allDayEvents: [],
      normalEvents: [],
      multiDayEvents: [],
    };
  });

  events.map((event) => {
    const { start, end } = event;
    const eventDuration = differenceInDays(end ?? addMinutes(start, 15), start);

    const weekOfMonthStart = getWeekOfMonth(start, {
      weekStartsOn,
    });
    const weekOfMonthEnd = getWeekOfMonth(end ?? addMinutes(start, 15), {
      weekStartsOn,
    });

    // does the event start and end in the same week
    if (weekOfMonthStart === weekOfMonthEnd) {
      const dayAsNumber = getDay(start);
      if (isAllDayEvent({ start, end: end ?? addMinutes(start, 15) })) {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`].allDayEvents.push({
          left: dayAsNumber * 120 + 1,
          top: (weekOfMonthStart - 1) * 120 + 33,
          duration: eventDuration,
          event,
        });
      } else if (eventDuration > 0) {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`].multiDayEvents.push({
          left: dayAsNumber * 120 + 1,
          top: (weekOfMonthStart - 1) * 120 + 33,
          duration: eventDuration,
          event,
        });
      } else {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`].normalEvents.push({
          left: dayAsNumber * 120 + 1,
          top: (weekOfMonthStart - 1) * 120 + 33,
          duration: eventDuration,
          event,
        });
      }
    }

    // does the event span over more than 1 week
    if (weekOfMonthEnd > weekOfMonthStart) {
      for (let i = weekOfMonthStart; i <= weekOfMonthEnd; i++) {
        if (i === weekOfMonthStart) {
          const startDayAsNumber = getDay(start);
          calendarWeeksEvents[`${i - 1}`].multiDayEvents.push({
            left: startDayAsNumber * 120 + 1,
            top: i * 120 + 33,
            duration: eventDuration,
            event,
          });
        } else {
          calendarWeeksEvents[`${i - 1}`].multiDayEvents.push({
            left: 1,
            duration: eventDuration,
            top: i * 120 + 33,
            event,
          });
        }
      }
    }
  });

  function sortEvents(
    a: { left: number; top: number; duration: number; event: CalendarEvent },
    b: { left: number; top: number; duration: number; event: CalendarEvent },
  ) {
    const startComparison = compareAsc(a.event.start, b.event.start);
    if (startComparison !== 0) return startComparison;
    return compareAsc(
      a.event.end ?? addMinutes(a.event.start, 15),
      b.event.end ?? addMinutes(b.event.start, 15),
    );
  }

  const sortedEvents = Object.keys(calendarWeeksEvents).map((week) => {
    const sortedMultiDayEvents =
      calendarWeeksEvents[week].multiDayEvents.sort(sortEvents);

    const sortedAllDayEvents =
      calendarWeeksEvents[week].allDayEvents.sort(sortEvents);
    const sortedNormalEvents =
      calendarWeeksEvents[week].normalEvents.sort(sortEvents);

    const sortedWeekEvents = [
      ...sortedMultiDayEvents,
      ...sortedAllDayEvents,
      ...sortedNormalEvents,
    ];

    return sortedWeekEvents;
  });

  return sortedEvents;
}

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
  }[],
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
          doEventsOverlap(groupEvent.event, event.event),
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
