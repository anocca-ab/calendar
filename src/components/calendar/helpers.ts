import type { SxProps } from "@mui/material";
import { differenceInMinutes, getHours, getMinutes } from "date-fns";
import { CalendarEvent } from "./build-sandpack";
import { CalendarEventWithRange } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Sx = SxProps<any>;
type ArrayType<T> = T extends ReadonlyArray<infer U> ? U[] : never;
type SxArray = ArrayType<Sx>;

/**
 * Use this function to merge sx props
 * @public
 */
export function mergeSx(...sxs: (Sx | null | undefined | boolean)[]): Sx {
  const sx: SxArray = [];

  sxs.forEach((passedSx) => {
    if (!passedSx) {
      return;
    }
    if (Array.isArray(passedSx)) {
      sx.push(...passedSx);
    } else {
      sx.push(passedSx);
    }
  });

  return sx;
}

/**
 * Receives events, calculates their ranges and returns an array of GridEventsWithRanges
 *
 * @param events
 * @returns
 */
export function getEventsWithRange(events: CalendarEvent[]) {
  return events.map((e, i) => {
    const hour = getHours(e.start);
    const minutes = getMinutes(e.start);

    const topPosition = hour * 60 + minutes;
    const duration = e.end
      ? differenceInMinutes(e.end, e.start, {
          roundingMethod: "floor",
        })
      : 15;

    return {
      start: topPosition,
      end: topPosition + duration,
      event: e,
    };
  });
}

/**
 * Receives an array of GridEventsWithRanges and returns an array of groups of events that overlap with each other
 *
 * @param events
 * @returns
 */
export function partitionGridEventsOnRanges(
  events: CalendarEventWithRange[],
): CalendarEventWithRange[][] {
  const rangedEventsGroups = [];
  let group = 0;

  const sortedEvents = events.sort(function (a, b) {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
  });

  rangedEventsGroups[group] = [sortedEvents[0]];

  for (let i = 1, l = sortedEvents.length; i < l; i++) {
    const maxEnd = getMaxEnd(rangedEventsGroups[group]);
    if (
      sortedEvents[i].start >= sortedEvents[i - 1].start &&
      sortedEvents[i].start < maxEnd
    ) {
      rangedEventsGroups[group].push(sortedEvents[i]);
    } else {
      group++;
      rangedEventsGroups[group] = [sortedEvents[i]];
    }
  }
  return rangedEventsGroups;
}

function getMaxEnd(events: CalendarEventWithRange[]): number {
  const sortedEvents = events.sort(function (a, b) {
    if (a.end < b.end) {
      return 1;
    }
    if (a.end > b.end) {
      return -1;
    }
    return 0;
  });
  return sortedEvents[0].end;
}
