export type StartDay = "monday" | "sunday";

export type CalendarEvent<T = undefined> = {
  /**
   * If (start - end) % 24 * 60 * 60 * 1000 === 0, the event is considered to be an all-day event
   */
  start: Date;
  /**
   * If `end` is not provided, the event is considered to be a task
   */
  end?: Date;
  /**
   * If no title is provided the default title is "(no title)"
   */
  title?: string;
  color?: string;
  data?: T;
};

export type OnChangeEventTime = (
  event: CalendarEvent,
  newStart: Date,
  newEnd: Date,
) => void;
export type OnSelectEvent = (event: CalendarEvent) => void;

export type CalendarEventWithRange = {
  // this is the start position in px used to describe distance from top
  start: number;
  // this is the end position in px used to describe distance from top
  end: number;
  left: number;
  height: string;
  event: CalendarEvent;
};

export type WeekCalendarState = {
  workWeek: boolean;
  startDay: StartDay;
  today: Date;
  currentFirstDayOfTheWeek: Date;
};
