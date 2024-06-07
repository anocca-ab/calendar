import type { SxProps } from "@mui/material";
import { CalendarEvent } from "./types";
import {
  addDays,
  areIntervalsOverlapping,
  endOfDay,
  startOfDay,
} from "date-fns";

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

export function getAllDayOverlaps(
  startOfWeek: Date,
  daysInWeek: number,
  events: CalendarEvent[],
) {
  const overlaps: { [key: string]: (CalendarEvent | undefined)[] } = {};
  const eventYSlots = new WeakMap<CalendarEvent, number>();
  for (let i = 0; i < daysInWeek; i++) {
    const eventsOnThisDay = events.filter((event) => {
      const dayStart = startOfDay(addDays(startOfDay(startOfWeek), i));
      const dayEnd = endOfDay(addDays(startOfDay(startOfWeek), i));
      return areIntervalsOverlapping(
        { start: dayStart, end: dayEnd },
        { start: event.start, end: event.end ?? event.start },
      );
    });

    /**
     * The y-position slots
     */
    const slots: (CalendarEvent | undefined)[] = [];

    let maxSlot: number | undefined = undefined;

    eventsOnThisDay.forEach((event) => {
      // check if the event has already been assigned a slot
      const ySlot = eventYSlots.get(event);
      if (typeof ySlot === "number") {
        // assign the event to the slot, so it is in the same y position as in the other day
        slots[ySlot] = event;

        if (maxSlot === undefined) {
          maxSlot = ySlot;
        }
        if (ySlot > maxSlot) {
          maxSlot = ySlot;
        }
      }
    });

    // populate the array
    if (maxSlot !== undefined) {
      for (let i = 0; i <= maxSlot; i += 1) {
        if (!slots[i]) {
          slots[i] = undefined;
        }
      }
    }

    eventsOnThisDay.forEach((event) => {
      if (slots.includes(event)) {
        return;
      }
      // check each posible slot
      for (let i = 0; i < eventsOnThisDay.length; i += 1) {
        if (!slots[i]) {
          slots[i] = event;
          break;
        }
      }
    });

    slots.forEach((event, i) => {
      // assign slots
      if (event) {
        eventYSlots.set(event, i);
      }
    });

    overlaps[i] = slots;
  }
  return overlaps;
}

export function isAllDayEvent(event: CalendarEvent) {
  return (
    // task
    !event.end ||
    // all day event, it is more than 24h
    (event.end &&
      event.end.getTime() - event.start.getTime() >= 24 * 60 * 60 * 1000) ||
    // all day event that is exactly 24h
    (event.start.getTime() === startOfDay(event.start).getTime() &&
      event.end.getTime() === endOfDay(event.start).getTime())
  );
}
