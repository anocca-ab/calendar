import {
  startOfDay,
  addDays,
  endOfDay,
  differenceInCalendarWeeks,
} from "date-fns";
import { splitMultiWeekEvents } from "./event_grid";
import { ModifiableEvent } from "../week_calendar/types";

jest.useFakeTimers().setSystemTime(new Date("2024-06-15"));

test("split_multi_week_events", () => {
  const event: ModifiableEvent = {
    start: startOfDay(addDays(new Date(), 1)), // 16th 00:00
    end: endOfDay(addDays(new Date(), 3)), // 18th 23:59,
    sourceEvent: {
      title: "3 day event",
      start: startOfDay(addDays(new Date(), 1)), // 16th 00:00
      end: endOfDay(addDays(new Date(), 3)), // 18th 23:59
      color: "pink",
    },
  };
  expect(
    differenceInCalendarWeeks(event.end, event.start, {
      weekStartsOn: 1,
    })
  ).toBe(1);
  expect(splitMultiWeekEvents([event], "monday")).toMatchInlineSnapshot(`
    [
      {
        "end": 2024-06-16T23:59:59.999Z,
        "sourceEvent": {
          "color": "pink",
          "end": 2024-06-18T23:59:59.999Z,
          "start": 2024-06-16T00:00:00.000Z,
          "title": "3 day event",
        },
        "start": 2024-06-16T00:00:00.000Z,
      },
      {
        "end": 2024-06-18T23:59:59.999Z,
        "sourceEvent": {
          "color": "pink",
          "end": 2024-06-18T23:59:59.999Z,
          "start": 2024-06-16T00:00:00.000Z,
          "title": "3 day event",
        },
        "start": 2024-06-17T00:00:00.000Z,
      },
    ]
  `);
});
