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
  format,
  differenceInCalendarWeeks,
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

/**
 * Events that cross into a new week are split into two events or more.
 * split up events that span multiple weeks into multiple events that span a maximum of 1 week
 * we also trim the events so they perfectly fit into our grid (see step 3)
 */
export function splitMultiWeekEvents(
  eventsInMonth: ModifiableEvent[],
  startDay: StartDay,
) {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] =
    startDay === "monday" ? 1 : 0;
  const events: ModifiableEvent[] = eventsInMonth.flatMap((defaultEvent) => {
    let parts: { start: Date; end: Date }[] = [];
    if (
      differenceInCalendarWeeks(defaultEvent.end, defaultEvent.start, {
        weekStartsOn,
      }) > 0
    ) {
      // split event up into multiple events to not overflow a single day
      // an event can't be longer than a day
      const part0 = {
        start: defaultEvent.start,
        end: endOfWeek(defaultEvent.start, { weekStartsOn }),
      };
      parts.push(part0);
      while (true) {
        const endOfPrevious = parts[parts.length - 1].end;
        const nextWeekStart = startOfWeek(addDays(endOfPrevious, 1), {
          weekStartsOn,
        });
        const nextWeekEnd = min([
          endOfWeek(nextWeekStart, {
            weekStartsOn,
          }),
          defaultEvent.end,
        ]);
        parts.push({
          start: nextWeekStart,
          end: nextWeekEnd,
        });
        if (nextWeekEnd.getTime() >= defaultEvent.end.getTime()) {
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
  return events;
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

  /**
   * This will hold all the properties about the events that we need to render them in the correct position
   */
  const eventProperties: {
    [
      /**
       * The key is the index of the event
       */
      key: string
    ]: { row: number; day: number; week: number };
  } = {};

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
   * Events that cross into a new week are split into two events or more
   */
  const events: ModifiableEvent[] = splitMultiWeekEvents(
    eventsInMonth,
    startDay,
  );

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
  const grid: (
    // event index
    {
      // metadata for the snapshot test
      index: number,
      title: string;
      start: string;
      end: string;
    }
  )[
    // row in a day
  ][
    // day
  ][
    // week
  ] = [];

  const assignEventToGrid = (
    week: number,
    day: number,
    eventIndex: number,
    event: ModifiableEvent,
  ) => {
    grid[week] = grid[week] ?? [];
    grid[week][day] = grid[week][day] ?? [];

    const rows = grid[week][day];

    // find the first available position
    const firstAvailableRow = rows.findIndex((e) => typeof e === "undefined");
    const row = firstAvailableRow === -1 ? rows.length : firstAvailableRow;
    rows[row] = {
      index: eventIndex,
      title: event.sourceEvent.title ?? "no title",
      start: format(event.start, "yyyy-MM-dd HH:mm"),
      end: format(event.end, "yyyy-MM-dd HH:mm"),
    };

    // only the first time we assign the event to the grid we will store the properties
    if (!eventProperties[eventIndex]) {
      eventProperties[eventIndex] = {
        row,
        day,
        week,
      };
    }
  };

  events.forEach((event, index) => {
    const week = differenceInWeeks(event.start, startOfMonthCalendar);
    const day = differenceInDays(
      event.start,
      startOfWeek(event.start, { weekStartsOn }),
    );

    assignEventToGrid(week, day, index, event);

    // we have a 1 day event - we will assign it to the grid according to the line above
    // we have a 2 day event - we will assign the first day of the event to the grid according to the line above
    //  - for a 2 day event, the loop with have d === 1, the end - start === 1 so the loop will loop only once
    for (let d = 1; d <= differenceInDays(event.end, event.start); d++) {
      const start = addDays(event.start, d);
      const week = differenceInWeeks(start, startOfMonthCalendar);
      const day = differenceInDays(start, startOfWeek(start, { weekStartsOn }));

      assignEventToGrid(week, day, index, event);
    }
  });
  return { grid, eventProperties, events };
}
