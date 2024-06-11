import {
  addMinutes,
  addWeeks,
  areIntervalsOverlapping,
  getDay,
  getWeekOfMonth,
  getWeeksInMonth,
  isSameDay,
} from "date-fns";
import { CalendarEvent, StartDay } from "../types";
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
      { gridEvents: CalendarEvent[]; allDayEvents: CalendarEvent[] }
    >
  > = {};
  const weeksOfMonth = getWeeksInMonth(now, {
    weekStartsOn: startDay == "sunday" ? 1 : 0,
  });

  // init the record with empty weeks & days
  [...Array(weeksOfMonth - 1)].forEach((_, week) => {
    calendarWeeksEvents[`${week}`] = {};
    [...Array(7)].forEach((_, day) => {
      calendarWeeksEvents[`${week}`][`${day}`] = {
        allDayEvents: [],
        gridEvents: [],
      };
    });
  });

  events.map((event) => {
    const { start, end } = event;
    const weekOfMonthStart = getWeekOfMonth(start);
    const weekOfMonthEnd = getWeekOfMonth(end ?? addMinutes(start, 15));

    // does the event start and end in the same week
    if (weekOfMonthStart === weekOfMonthEnd) {
      // is same day event
      if (isSameDay(start, end ?? addMinutes(start, 15))) {
        const dayAsNumber = getDay(start);
        // add event to week X on day Y
        if (
          start &&
          end &&
          (end.getTime() - start.getTime()) % (24 * 60 * 60 * 1000) === 0
        ) {
          calendarWeeksEvents[`${weekOfMonthStart - 1}`][
            `${dayAsNumber}`
          ].allDayEvents.push(event);
        } else {
          calendarWeeksEvents[`${weekOfMonthStart - 1}`][
            `${dayAsNumber}`
          ].gridEvents.push(event);
        }
      } else {
        const startDayAsNumber = getDay(start);
        const endDayAsNumber = getDay(end ?? addMinutes(start, 15));
        for (let i = startDayAsNumber; i <= endDayAsNumber; i++) {
          if (
            start &&
            end &&
            (end.getTime() - start.getTime()) % (24 * 60 * 60 * 1000) === 0
          ) {
            calendarWeeksEvents[`${weekOfMonthStart - 1}`][
              `${i}`
            ].allDayEvents.push(event);
          } else {
            calendarWeeksEvents[`${weekOfMonthStart - 1}`][
              `${i}`
            ].gridEvents.push(event);
          }
        }
      }
    }

    // does the event span over more than 1 week
    if (weekOfMonthEnd > weekOfMonthStart) {
      for (let i = weekOfMonthStart; i <= weekOfMonthEnd; i++) {
        // fill the first week of reoccuring event
        if (i === weekOfMonthStart) {
          const startDayAsNumber = getDay(start);
          for (let j = startDayAsNumber; j <= 6; j++) {
            if (
              start &&
              end &&
              (end.getTime() - start.getTime()) % (24 * 60 * 60 * 1000) === 0
            ) {
              calendarWeeksEvents[`${i - 1}`][`${j}`].allDayEvents.push(event);
            } else {
              calendarWeeksEvents[`${i - 1}`][`${j}`].gridEvents.push(event);
            }
          }
        }
        // fill the last week of reoccuring event
        else if (i === weekOfMonthEnd) {
          const endDayAsNumber = getDay(end ?? addMinutes(start, 15));
          for (let j = 0; j <= endDayAsNumber; j++) {
            if (
              start &&
              end &&
              (end.getTime() - start.getTime()) % (24 * 60 * 60 * 1000) === 0
            ) {
              calendarWeeksEvents[`${i - 1}`][`${j}`].allDayEvents.push(event);
            } else {
              calendarWeeksEvents[`${i - 1}`][`${j}`].gridEvents.push(event);
            }
          }
        }
        // fill the inbetween weeks of reoccuring event
        else {
          for (let j = 0; j <= 6; j++) {
            if (
              start &&
              end &&
              (end.getTime() - start.getTime()) % (24 * 60 * 60 * 1000) === 0
            ) {
              calendarWeeksEvents[`${i - 1}`][`${j}`].allDayEvents.push(event);
            } else {
              calendarWeeksEvents[`${i - 1}`][`${j}`].gridEvents.push(event);
            }
          }
        }
      }
    }
  });

  return calendarWeeksEvents;
}
