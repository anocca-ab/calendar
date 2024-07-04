/**
 * * `if (startOfDay(event.start) === event.start && endOfDay(event.start) === event.end)` the event is considered to be an all-day event
 * * `if (differenceInCalendarDays(event.end, event.start) === >= 1)` the event is considered to be an all-day event
 */
export type CalendarEvent<T = undefined> = {
  start: Date;
  /**
   * * If `end` is not provided, the event is considered to be a full day task.
   * * If end === start it is considered to be a task that lasts for 15 min.
   */
  end?: Date;
  /**
   * If no title is provided the default title is "(no title)"
   */
  title?: string;
  color?: string;
  canEdit?: boolean;
  data?: T;
};

export type StartDay = "monday" | "sunday";

export type TimelineResolution = "month" | "3-months" | "year" | "3-years";
