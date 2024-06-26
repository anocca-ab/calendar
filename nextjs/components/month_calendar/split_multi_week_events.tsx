import {
  StartOfWeekOptions,
  addDays, differenceInCalendarWeeks, endOfWeek, min,
  startOfWeek
} from "date-fns";
import { StartDay } from "../types";
import { ModifiableEvent } from "../week_calendar/types";

/**
 * Events that cross into a new week are split into two events or more.
 * split up events that span multiple weeks into multiple events that span a maximum of 1 week
 * we also trim the events so they perfectly fit into our grid (see step 3)
 */
export function splitMultiWeekEvents(
  eventsInMonth: ModifiableEvent[],
  startDay: StartDay
) {
  const weekStartsOn: StartOfWeekOptions["weekStartsOn"] = startDay === "monday" ? 1 : 0;
  const events: ModifiableEvent[] = eventsInMonth.flatMap((defaultEvent) => {
    let parts: { start: Date; end: Date; }[] = [];
    if (differenceInCalendarWeeks(defaultEvent.end, defaultEvent.start, {
      weekStartsOn,
    }) > 0) {
      // split event up into multiple events to not overflow a single day
      // an event can't be longer than a day
      const part0 = {
        start: defaultEvent.start,
        end: endOfWeek(defaultEvent.start, { weekStartsOn }),
      };
      parts.push(part0);
      while (true) {
        const endOfPrevious = parts[parts.length - 1].end;
        const nextWeekStart = startOfWeek(addDays(endOfPrevious, 1), {
          weekStartsOn,
        });
        const nextWeekEnd = min([
          endOfWeek(nextWeekStart, {
            weekStartsOn,
          }),
          defaultEvent.end,
        ]);
        parts.push({
          start: nextWeekStart,
          end: nextWeekEnd,
        });
        if (nextWeekEnd.getTime() >= defaultEvent.end.getTime()) {
          break;
        }
      }
      return parts.map((part) => ({
        sourceEvent: defaultEvent.sourceEvent,
        start: part.start,
        end: part.end,
      }));
    }
    return defaultEvent;
  });
  return events;
}
