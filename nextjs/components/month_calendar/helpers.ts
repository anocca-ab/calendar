import { Typography, styled } from "@mui/material";
import {
  addMinutes,
  addWeeks,
  areIntervalsOverlapping,
  differenceInCalendarDays,
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

/**
 * Returns a record of weeks of which each week contains a record that represents a day of the week.
 * Each day contains an object with two array fields: allDayEvents and gridEvents
 *
 * @param events
 * @param startDay
 * @param now
 * @returns
 */
export function getEventsPerWeekAndDay(
  events: CalendarEvent[],
  startDay: StartDay,
  now: Date,
) {
  const calendarWeeksEvents: Record<
    string,
    Record<
      string,
      {
        normalEvents: CalendarEvent[];
        allDayEvents: CalendarEvent[];
        multiDayEvents: CalendarEvent[];
      }
    >
  > = {};
  const weekStartsOn = startDay === "monday" ? 1 : 0;
  const weeksOfMonth = getWeeksInMonth(now, {
    weekStartsOn,
  });

  // init the record with empty weeks & days
  [...Array(weeksOfMonth)].forEach((_, week) => {
    calendarWeeksEvents[`${week}`] = {};
    [...Array(7)].forEach((_, day) => {
      calendarWeeksEvents[`${week}`][`${day}`] = {
        allDayEvents: [],
        normalEvents: [],
        multiDayEvents: [],
      };
    });
  });

  events.map((event) => {
    const { start, end } = event;
    const weekOfMonthStart = getWeekOfMonth(start, {
      weekStartsOn,
    });
    const weekOfMonthEnd = getWeekOfMonth(end ?? addMinutes(start, 15), {
      weekStartsOn,
    });

    //TODO: Add better logic to check spanning months

    // does the event start and end in the same week
    if (weekOfMonthStart === weekOfMonthEnd) {
      const dayAsNumber = getDay(start);
      // check if it is an all day event
      // then add event to week X on day Y
      if (isAllDayEvent({ start, end: end ?? addMinutes(start, 15) })) {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`][
          `${dayAsNumber}`
        ].allDayEvents.push(event);
      } else if (
        differenceInCalendarDays(end ?? addMinutes(start, 15), start) > 0
      ) {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`][
          `${dayAsNumber}`
        ].multiDayEvents.push(event);
      } else {
        calendarWeeksEvents[`${weekOfMonthStart - 1}`][
          `${dayAsNumber}`
        ].normalEvents.push(event);
      }
    }

    // does the event span over more than 1 week
    if (weekOfMonthEnd > weekOfMonthStart) {
      for (let i = weekOfMonthStart; i <= weekOfMonthEnd; i++) {
        if (i === weekOfMonthStart) {
          const startDayAsNumber = getDay(start);
          calendarWeeksEvents[`${i - 1}`][
            `${startDayAsNumber}`
          ].multiDayEvents.push(event);
        } else {
          calendarWeeksEvents[`${i - 1}`][`${0}`].multiDayEvents.push(event);
        }
      }
    }
  });

  return calendarWeeksEvents;
}
