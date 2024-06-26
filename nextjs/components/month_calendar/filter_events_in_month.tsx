import { areIntervalsOverlapping, max, min } from "date-fns";
import { getEventEnd } from "../helpers";
import { StartDay } from "../types";
import { ModifiableEvent } from "../week_calendar/types";
import { monthCalendarRange } from "../event_grid";

export function filterEventsInMonth(
  _events: ModifiableEvent[],
  startDay: StartDay,
  startOfMonth: Date
) {
  const { startOfMonthCalendar, endOfMonthCalendar } = monthCalendarRange(
    startDay,
    startOfMonth
  );
  const eventsInMonth: ModifiableEvent[] = _events
    .filter((event) => {
      return areIntervalsOverlapping(
        { start: startOfMonthCalendar, end: endOfMonthCalendar },
        { start: event.start, end: getEventEnd(event) }
      );
    })
    .map((event) => {
      let start = max([event.start, startOfMonthCalendar]);
      let end = min([getEventEnd(event), endOfMonthCalendar]);
      return {
        sourceEvent: event.sourceEvent,
        start: start,
        end: end,
      };
    });
  return eventsInMonth;
}
