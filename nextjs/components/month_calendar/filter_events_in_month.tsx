import { addMinutes, areIntervalsOverlapping, max, min } from "date-fns";
import { getEventEnd, getEventStart } from "../helpers";
import { StartDay } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import { monthCalendarRange } from "../event_grid";

export function filterEventsInMonth<T>(
  events: ModifiableEvent<T>[],
  startDay: StartDay,
  startOfMonth: Date
) {
  const { startOfMonthCalendar, endOfMonthCalendar } = monthCalendarRange(
    startDay,
    startOfMonth
  );
  const eventsInMonth: ModifiableEvent<T>[] = events.filter((event) => {
    return areIntervalsOverlapping(
      { start: startOfMonthCalendar, end: endOfMonthCalendar },
      { start: getEventStart(event), end: getEventEnd(event) }
    );
  });
  return eventsInMonth;
}
