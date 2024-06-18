import { CalendarEvent } from "../types";

export type ModifiableEvent = {
  /**
   * The real calendar event
   */
  sourceEvent: CalendarEvent;
  /**
   * "Prettified" start time, so that it fits the use case
   */
  start: Date;
  /**
   * "Prettified" end time, so that it fits the use case
   */
  end: Date;
};
