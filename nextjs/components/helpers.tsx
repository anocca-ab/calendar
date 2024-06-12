import type { SxProps } from "@mui/material";
import { endOfDay, startOfDay } from "date-fns";
import { CalendarEvent } from "./types";

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
