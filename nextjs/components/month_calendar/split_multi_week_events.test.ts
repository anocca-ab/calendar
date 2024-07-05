import {
  startOfDay,
  addDays,
  endOfDay,
  differenceInCalendarWeeks,
} from "date-fns";
import { splitMultiWeekEvents } from "./split_multi_week_events";
import { ModifiableEvent } from "../week_calendar/types";

jest.useFakeTimers().setSystemTime(new Date("2024-06-15"));

test("split_multi_week_events", () => {
  const event: ModifiableEvent<undefined> = {
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

test("split_multi_week_events", () => {
  const event: ModifiableEvent<undefined> = {
    start: startOfDay(addDays(new Date(), 0)), // 15th 00:00
    end: endOfDay(addDays(new Date(), 1)), // 16th 23:59,
    sourceEvent: {
      title: "2 day event",
      start: startOfDay(addDays(new Date(), 0)), // 15th 00:00
      end: endOfDay(addDays(new Date(), 1)), // 16th 23:59,
      color: "pink",
    },
  };
  expect(
    differenceInCalendarWeeks(event.end, event.start, {
      weekStartsOn: 1,
    })
  ).toBe(0);
  expect(splitMultiWeekEvents([event], "monday")).toMatchInlineSnapshot(`
    [
      {
        "end": 2024-06-16T23:59:59.999Z,
        "sourceEvent": {
          "color": "pink",
          "end": 2024-06-16T23:59:59.999Z,
          "start": 2024-06-15T00:00:00.000Z,
          "title": "2 day event",
        },
        "start": 2024-06-15T00:00:00.000Z,
      },
    ]
  `);
  /**
   * 5 day event (4 days + end of day)
   */
  const longerEvent: ModifiableEvent<undefined> = {
    sourceEvent: {
      start: startOfDay(addDays(new Date(), 5)),
      end: endOfDay(addDays(addDays(new Date(), 5), 4)),
    },
    start: startOfDay(addDays(new Date(), 5)),
    end: endOfDay(addDays(addDays(new Date(), 5), 4)),
  };
  expect(splitMultiWeekEvents([longerEvent], "monday")).toMatchInlineSnapshot(`
    [
      {
        "end": 2024-06-23T23:59:59.999Z,
        "sourceEvent": {
          "end": 2024-06-24T23:59:59.999Z,
          "start": 2024-06-20T00:00:00.000Z,
        },
        "start": 2024-06-20T00:00:00.000Z,
      },
      {
        "end": 2024-06-24T23:59:59.999Z,
        "sourceEvent": {
          "end": 2024-06-24T23:59:59.999Z,
          "start": 2024-06-20T00:00:00.000Z,
        },
        "start": 2024-06-24T00:00:00.000Z,
      },
    ]
  `);
});
