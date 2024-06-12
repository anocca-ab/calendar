import { CalendarEvent } from "../types";

export type CalendarGridEvent = {
  sourceEvent: CalendarEvent;
  start: Date;
  end: Date;
};
