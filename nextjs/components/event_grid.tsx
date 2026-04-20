import {
  StartOfWeekOptions,
  addDays,
  addWeeks,
  differenceInCalendarWeeks,
  differenceInDays,
  endOfWeek,
  startOfMonth as fnsStartOfMonth,
  format,
  lastDayOfMonth,
  max,
  min,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { CalendarGroupConfig, StartDay } from "./types";
import { ModifiableEvent } from "./week_calendar/types";
import { getEventEnd, getEventStart } from "./helpers";

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

export function eventGrid<T>(
  events: ModifiableEvent<T>[],
  startDay: StartDay,
  startTime: Date,
  endTime: Date,
  maxEventsPerDay: number,
  groupConfig?: CalendarGroupConfig<T>,
) {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] =
    startDay === "monday" ? 1 : 0;

  // Build a lookup: sourceEvent object → groupIndex (0-based index into groupConfig.groups)
  const groupIndexMap = new WeakMap<object, number>();
  if (groupConfig) {
    groupConfig.groups.forEach((group, gi) => {
      group.events.forEach((ev) => {
        groupIndexMap.set(ev as object, gi);
      });
    });
  }
  const numGroups = groupConfig ? groupConfig.groups.length : 1;

  const getGroupIndex = (event: ModifiableEvent<T>): number => {
    if (!groupConfig) return 0;
    return groupIndexMap.get(event.sourceEvent as object) ?? 0;
  };

  /**
   * This will hold all the properties about the events that we need to render them in the correct position.
   * When groupConfig is provided, `day` stores the effective column: day * numGroups + groupIndex.
   */
  const eventProperties: {
    [
      /**
       * The index of the event
       */
      index: string
    ]: {
      row: number;
      /**
       * When groupConfig is provided this is the effective column index:
       * day * numGroups + groupIndex. Otherwise it is just the day-of-week (0–6).
       */
      day: number;
      week: number;
      startDay: number;
      endDay: number;
      inMoreButton: boolean;
      groupIndex: number;
    };
  } = {};

  // step 2.
  // sort the events by 1. start date and 2. duration
  events.sort((a, b) => {
    const startComparison = a.start.getTime() - b.start.getTime();
    if (startComparison !== 0) return startComparison;
    return b.end.getTime() - a.end.getTime();
  });

  // step 3.
  // for each week we have a grid of (7*numGroups) x 5 positions. We loop over each event during the week and occupy the first available positions in the grid
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
    // row in a day×group slot
  ][
    // col = day * numGroups + groupIndex
  ][
    // week
  ] = [];

  const assignEventToGrid = (
    week: number,
    day: number,
    groupIndex: number,
    eventIndex: number,
    {
      event,
      eventStart,
      eventEnd,
      endDay,
      startDay,
    }: {
      event: ModifiableEvent<T>;
      eventStart: Date;
      eventEnd: Date;
      endDay: number;
      startDay: number;
    },
  ) => {
    // The effective column in the grid is day*numGroups + groupIndex
    const col = day * numGroups + groupIndex;
    grid[week] = grid[week] ?? [];
    grid[week][col] = grid[week][col] ?? [];

    const rows = grid[week][col];

    // find the first available position
    let occupiedRows: number[] = [];
    let pinnedRow = -1;
    grid[week].forEach((weekCol, colIndex) => {
      // Only check occupancy within the same group lane
      if (
        Math.floor(colIndex / numGroups) === Math.floor(col / numGroups) &&
        colIndex % numGroups === groupIndex
      ) {
        weekCol.forEach((event, row) => {
          const ev = events[event.index];
          const eventEnd = min([getEventEnd(ev), endTime]);
          const evEndDay = differenceInDays(
            eventEnd,
            startOfWeek(eventEnd, { weekStartsOn }),
          );
          if (evEndDay >= day) {
            if (event.index === eventIndex) {
              pinnedRow = row;
            } else {
              occupiedRows.push(row);
            }
          }
        });
      }
    });
    let firstAvailableRow = pinnedRow !== -1 ? pinnedRow : rows.length;
    if (pinnedRow === -1) {
      for (let i = 0; i < Math.max(...occupiedRows); i += 1) {
        if (!occupiedRows.includes(i)) {
          firstAvailableRow = i;
          break;
        }
      }
    }

    rows[firstAvailableRow] = {
      index: eventIndex,
      title: event.sourceEvent.title ?? "no title",
      start: format(event.start, "yyyy-MM-dd HH:mm"),
      end: format(event.end, "yyyy-MM-dd HH:mm"),
    };

    // only the first time we assign the event to the grid we will store the properties
    if (!eventProperties[eventIndex]) {
      eventProperties[eventIndex] = {
        row: firstAvailableRow,
        // Store col so callers can use it directly as the x-offset
        day: col,
        week,
        startDay: day * numGroups + groupIndex,
        endDay: endDay * numGroups + groupIndex,
        inMoreButton: false,
        groupIndex,
      };
    }
  };

  events.forEach((event, index) => {
    const eventStart = max([getEventStart(event), startTime]);
    const eventEnd = min([getEventEnd(event), endTime]);
    const groupIndex = getGroupIndex(event);

    const week = differenceInCalendarWeeks(eventStart, startTime, {
      weekStartsOn,
    });
    const day = differenceInDays(
      eventStart,
      startOfWeek(eventStart, { weekStartsOn }),
    );

    const endDay = differenceInDays(
      eventEnd,
      startOfWeek(eventStart, { weekStartsOn }),
    );

    assignEventToGrid(week, day, groupIndex, index, {
      event,
      startDay: day,
      endDay,
      eventStart,
      eventEnd,
    });

    // we have a 1 day event - we will assign it to the grid according to the line above
    // we have a 2 day event - we will assign the first day of the event to the grid according to the line above
    //  - for a 2 day event, the loop with have d === 1, the end - start === 1 so the loop will loop only once
    for (let d = 1; d <= differenceInDays(eventEnd, eventStart); d++) {
      const start = addDays(eventStart, d);
      const week = differenceInCalendarWeeks(start, startTime, {
        weekStartsOn,
      });
      const day = differenceInDays(start, startOfWeek(start, { weekStartsOn }));

      assignEventToGrid(week, day, groupIndex, index, {
        event,
        startDay: day,
        endDay,
        eventStart: start,
        eventEnd,
      });
    }
  });

  const maxRows: number /* week / col */[][] = [];

  // get max row
  grid.forEach((week, weekIndex) => {
    week.forEach((col, colIndex) => {
      if (!Array.isArray(maxRows[weekIndex])) {
        maxRows[weekIndex] = [];
      }
      maxRows[weekIndex][colIndex] = Math.max(
        col.length,
        maxRows[weekIndex][colIndex] || 0,
      );
    });
  });

  // construct the list of more buttons

  const moreButtonsDict: Record<
    /**
     * The key is `${week}-${col}` where col = day*numGroups + groupIndex
     */
    string,
    MoreButton<T>
  > = {};

  events.forEach((event, eventIndex) => {
    const { week, row, startDay, endDay, groupIndex } =
      eventProperties[eventIndex];
    for (let col = startDay; col <= endDay; col += numGroups) {
      const key = `${week}-${col}`;
      const day = Math.floor(col / numGroups);

      let moreButton = moreButtonsDict[key];
      if (moreButton) {
        moreButton.allEvents.push(eventIndex);
      } else {
        const date = startOfDay(addDays(addWeeks(startTime, week), day));
        moreButtonsDict[key] = {
          week,
          day: col,
          groupIndex,
          events: [],
          allEvents: [eventIndex],
          date,
        };
        moreButton = moreButtonsDict[key];
      }
      const pushEvent = () => {
        moreButton.events.push(eventIndex);
        eventProperties[eventIndex].inMoreButton = true;
      };
      const maxRow = maxRows[week][col];
      eventProperties[eventIndex];
      if (maxRow > maxEventsPerDay) {
        // has more button
        if (row >= maxEventsPerDay - 1) {
          pushEvent();
        }
      } else {
        if (row >= maxEventsPerDay) {
          pushEvent();
        }
      }
    }
  });

  return {
    grid,
    eventProperties,
    events,
    moreButtons: Object.values(moreButtonsDict).filter(
      (button) => button.events.length > 0,
    ),
  };
}

export type MoreButton<T> = {
  week: number;
  /** When groupConfig is active this is the effective column (day * numGroups + groupIndex) */
  day: number;
  groupIndex: number;
  date: Date;
  events: number[];
  allEvents: number[];
};
