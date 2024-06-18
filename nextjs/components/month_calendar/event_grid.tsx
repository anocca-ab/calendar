import {
  areIntervalsOverlapping,
  max,
  min,
  differenceInWeeks,
  endOfWeek,
  startOfWeek,
  addDays,
  differenceInDays,
  StartOfWeekOptions,
  lastDayOfMonth,
  startOfMonth as fnsStartOfMonth,
  addWeeks,
} from "date-fns";
import { getEventEnd } from "../helpers";
import { ModifiableEvent } from "../week_calendar/types";
import { CalendarEvent, StartDay } from "../types";

export function monthCalendarRange(startDay: StartDay, startOfMonth: Date) {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] =
    startDay === "monday" ? 1 : 0;

  const startOfMonthCalendar = startOfWeek(fnsStartOfMonth(startOfMonth), {
    weekStartsOn,
  });
  const endOfMonthCalendar = endOfWeek(lastDayOfMonth(startOfMonth), {
    weekStartsOn,
  });
  return { startOfMonthCalendar, endOfMonthCalendar };
}

export function filterEventsInMonth(
  _events: CalendarEvent[],
  startDay: StartDay,
  startOfMonth: Date,
) {
  const { startOfMonthCalendar, endOfMonthCalendar } = monthCalendarRange(
    startDay,
    startOfMonth,
  );
  const eventsInMonth: ModifiableEvent[] = _events
    .filter((event) => {
      return areIntervalsOverlapping(
        { start: startOfMonthCalendar, end: endOfMonthCalendar },
        { start: event.start, end: getEventEnd(event) },
      );
    })
    .map((event) => {
      let start = max([event.start, startOfMonthCalendar]);
      let end = min([getEventEnd(event), endOfMonthCalendar]);
      return {
        sourceEvent: event,
        start: start,
        end: end,
      };
    });
  return eventsInMonth;
}

export function eventGrid(
  _events: CalendarEvent[],
  startDay: StartDay,
  startOfMonth: Date,
) {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] =
    startDay === "monday" ? 1 : 0;
  const { startOfMonthCalendar, endOfMonthCalendar } = monthCalendarRange(
    startDay,
    startOfMonth,
  );

  // step 0.
  // get all the events that are part of the month
  const eventsInMonth: ModifiableEvent[] = filterEventsInMonth(
    _events,
    startDay,
    startOfMonth,
  );

  // step 1.
  // split up events that span multiple weeks into multiple events that span a maximum of 1 week
  // we also trim the events so they perfectly fit into our grid (see step 3)
  /**
   * Events that cross 12am are split into two events
   */
  const events: ModifiableEvent[] = eventsInMonth.flatMap((defaultEvent) => {
    let parts: { start: Date; end: Date }[] = [];
    if (differenceInWeeks(defaultEvent.end, defaultEvent.start) > 0) {
      // split event up into multiple events to not overflow a single day
      // an event can't be longer than a day

      const part0 = {
        start: defaultEvent.start,
        end: endOfWeek(defaultEvent.start, { weekStartsOn }),
      };
      parts.push(part0);
      let i = 0;
      while (true) {
        const startOfPrevious = parts[parts.length - 1].start;
        const nextWeek = startOfWeek(addWeeks(startOfPrevious, 1));
        const nextWeekEnd = min([endOfWeek(nextWeek), defaultEvent.end]);
        parts.push({
          start: nextWeek,
          end: nextWeekEnd,
        });
        if (nextWeekEnd.getTime() >= defaultEvent.end.getTime()) {
          break;
        }
        i++;
        if (i > 100) {
          console.log(nextWeekEnd, defaultEvent.end);
          break;
        }
      }
      return parts.map((part) => ({
        sourceEvent: defaultEvent.sourceEvent,
        start: part.start,
        end: part.end,
      }));
    }
    return defaultEvent;
  });

  // step 2.
  // sort the events by 1. start date and 2. duration
  events.sort((a, b) => {
    const startComparison = a.start.getTime() - b.start.getTime();
    if (startComparison !== 0) return startComparison;
    return b.end.getTime() - a.end.getTime();
  });

  // step 3.
  // for each week we have a grid of 7x5 positions. We loop over each event during the week and occupy the first available positions in the grid
  // in this process we will get the x, y position for each event
  // prettier-ignore
  const grid: (ModifiableEvent | null)[
    // row in a day
  ][
    // day
  ][
    // week
  ] = [];

  events.forEach((event) => {
    const week = differenceInWeeks(event.start, startOfMonthCalendar);
    const day = differenceInDays(
      event.start,
      startOfWeek(event.start, { weekStartsOn }),
    );
    grid[week] = grid[week] ?? [];
    grid[week][day] = grid[week][day] ?? [];

    const rows = grid[week][day];

    // find the first available position
    const firstAvailableRow = rows.findIndex((e) => typeof e === "undefined");
    rows[firstAvailableRow === -1 ? rows.length : firstAvailableRow] = event;
    // we have a 1 day event - we will assign it to the grid according to the line above
    // we have a 2 day event - we will assign the first day of the event to the grid according to the line above
    //  - for a 2 day event, the loop with have d === 1, the end - start === 1 so the loop will loop only once
    for (let d = 1; d <= differenceInDays(event.end, event.start); d++) {
      const start = addDays(event.start, d);
      const week = differenceInWeeks(start, startOfMonthCalendar);
      const day = differenceInDays(start, startOfWeek(start, { weekStartsOn }));

      grid[week] = grid[week] ?? [];
      grid[week][day] = grid[week][day] ?? [];

      const rows = grid[week][day];

      const firstAvailableRow = rows.findIndex((e) => typeof e === "undefined");
      rows[firstAvailableRow === -1 ? rows.length : firstAvailableRow] = event;
    }
  });
  return grid;
}
