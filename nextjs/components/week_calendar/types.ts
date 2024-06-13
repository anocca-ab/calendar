import { CalendarEvent } from "../types";

export type ModifiableEvent = {
  sourceEvent: CalendarEvent;
  start: Date;
  end: Date;
};
