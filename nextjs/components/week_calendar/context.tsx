import React from "react";
import { CalendarEvent, StartDay } from "../types";

type RawContext<T> =
  | undefined
  | {
      startDay: StartDay;
      workWeek: boolean;
      startOfWeek: Date;
      now: Date;
      onCreateEvent?: (start: Date, end: Date) => void;
      onEditEvent?: (event: CalendarEvent<T>, nativeEvent: MouseEvent) => void;
      onMoveEvent?: (
        event: CalendarEvent<T>,
        newStart: Date,
        newEnd: Date | undefined
      ) => void;
      dragCreateEvent?: (start: Date, end?: Date) => void;
      defaultEventColor: string;
    };
export const CalendarConfigContext =
  React.createContext<RawContext<any>>(undefined);

export function useCalendar<T>() {
  const ctx: RawContext<T> = React.useContext(CalendarConfigContext);
  if (!ctx) {
    throw new Error("useCalendar must be used within a CalendarConfigContext");
  }
  return ctx;
}
