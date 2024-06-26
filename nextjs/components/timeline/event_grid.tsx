import {
  StartOfWeekOptions,
  addDays,
  addMonths,
  areIntervalsOverlapping,
  differenceInCalendarMonths,
  differenceInDays,
  differenceInHours,
  differenceInWeeks,
  endOfMonth,
  endOfWeek,
  format,
  max,
  min,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { StartDay } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import { monthCalendarRange } from "../month_calendar/event_grid";
import { getEventEnd } from "../helpers";

export function filterEventsInMonth(
  _events: ModifiableEvent[],
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
        sourceEvent: event.sourceEvent,
        start: start,
        end: end,
      };
    });
  return eventsInMonth;
}

export function eventGrid(
  _events: ModifiableEvent[],
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
       * The index of the event
       */
      index: string
    ]: { row: number; day: number; hourSlot: number; maxRow: number };
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
  // for each row we have a grid of '(daysPerMonth x 8 hourSlots )' positions. We loop over each event during the week and occupy the first available positions in the grid
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
      // hourSlot
    ] = [];

  const assignEventToGrid = (
    day: number,
    hourSlot: number,
    eventIndex: number,
    event: ModifiableEvent,
  ) => {
    grid[day] = grid[day] ?? [];
    grid[day][hourSlot] = grid[day][hourSlot] ?? [];

    const rows = grid[day][hourSlot];

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
        hourSlot,
        maxRow: 0,
      };
    }
  };

  events.forEach((event, index) => {
    const day = differenceInDays(event.start, startOfMonthCalendar);
    const hourSlot = Math.floor(
      differenceInHours(event.start, startOfDay(event.start)) / 3,
    );
    // we only 2px per hourSlot
    assignEventToGrid(day, hourSlot, index, event);

    // we have a 1 day event - we will assign it to the grid according to the line above
    // we have a 2 day event - we will assign the first day of the event to the grid according to the line above
    //  - for a 2 day event, the loop with have d === 1, the end - start === 1 so the loop will loop only once
    for (let d = 1; d <= differenceInDays(event.end, event.start); d++) {
      const start = addDays(event.start, d);
      const day = differenceInDays(start, startOfMonthCalendar);
      for (let s = 1; s <= 8; s++) {
        assignEventToGrid(day, s, index, event);
      }
    }
  });

  // get max row
  grid.forEach((day) => {
    day.forEach((hourSlot) => {
      hourSlot.forEach((event) => {
        eventProperties[event.index].maxRow = Math.max(
          day.length,
          eventProperties[event.index].maxRow,
        );
      });
    });
  });

  // construct the list of more buttons
  type MoreButton = {
    hourSlot: number;
    day: number;
    events: ModifiableEvent[];
  };

  const moreButtonsDict: Record<
    /**
     * The key is the `${week}-${day}`
     */
    string,
    MoreButton
  > = {};

  events.forEach((event, eventIndex) => {
    const { hourSlot, day, row, maxRow } = eventProperties[eventIndex];
    if (maxRow <= 5 ? row >= 5 : row >= 4) {
      const key = `${day}-${hourSlot}`;
      const moreButton = moreButtonsDict[key];
      if (moreButton) {
        moreButton.events.push(event);
      } else {
        moreButtonsDict[key] = {
          day,
          hourSlot,
          events: [event],
        };
      }
    }
  });

  return {
    grid,
    eventProperties,
    events,
    moreButtons: Object.values(moreButtonsDict),
  };
}

export function splitMultiWeekEvents(
  eventsInMonth: ModifiableEvent[],
  startDay: StartDay,
) {
  const events: ModifiableEvent[] = eventsInMonth.flatMap((defaultEvent) => {
    let parts: { start: Date; end: Date }[] = [];
    if (differenceInCalendarMonths(defaultEvent.end, defaultEvent.start) > 0) {
      // split event up into multiple events to not overflow a single day
      // an event can't be longer than a day
      const part0 = {
        start: defaultEvent.start,
        end: endOfMonth(defaultEvent.start),
      };
      parts.push(part0);
      while (true) {
        const endOfPrevious = parts[parts.length - 1].end;
        const nextMonthStart = startOfMonth(addMonths(endOfPrevious, 1));

        const nextMonthEnd = min([
          endOfMonth(nextMonthStart),
          defaultEvent.end,
        ]);
        parts.push({
          start: nextMonthStart,
          end: nextMonthEnd,
        });
        if (nextMonthEnd.getTime() >= defaultEvent.end.getTime()) {
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
