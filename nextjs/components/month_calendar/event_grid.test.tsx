import {
  subMinutes,
  startOfDay,
  addMinutes,
  addDays,
  endOfDay,
  subHours,
  subWeeks,
  addWeeks,
} from "date-fns";
import { CalendarEvent } from "../types";
import { eventGrid, filterEventsInMonth } from "./event_grid";

jest.useFakeTimers().setSystemTime(new Date("2024-06-15"));

const events: CalendarEvent[] = [
  {
    // data: { id: "1" },
    title: "Task",
    start: subMinutes(new Date(), 30),
    color: "pink",
  },
  {
    title: "Full day event",
    start: startOfDay(new Date()),
    end: addMinutes(startOfDay(new Date()), 1339),
    color: "pink",
  },
  {
    title: "2 days event",
    start: startOfDay(addDays(new Date(), 2)),
    end: endOfDay(addDays(new Date(), 2)),
    color: "pink",
  },
  {
    title: "4 days event",
    start: startOfDay(addDays(new Date(), 1)),
    end: endOfDay(addDays(addDays(new Date(), 1), 4)),
    color: "red",
  },
  // {
  //   title: "10min event",
  //   start: subHours(new Date(), 3),
  //   end: addMinutes(subHours(new Date(), 3), 10),
  //   color: "orange",
  // },
  // {
  //   title: "15min event",
  //   start: addDays(new Date(), 2),
  //   end: addMinutes(addDays(new Date(), 2), 15),
  //   color: "red",
  // },
  // {
  //   title: "36 min event",
  //   start: addMinutes(new Date(), 15),
  //   end: addMinutes(addMinutes(new Date(), 15), 36),
  //   color: "teal",
  // },
  // {
  //   title: "2 hours event",
  //   start: new Date(),
  //   end: addMinutes(new Date(), 120),
  //   color: "pink",
  // },
  // {
  //   title: "3 hours event",
  //   start: new Date(),
  //   end: addMinutes(new Date(), 181),
  //   color: "indigo",
  // },
];

xtest("works with a task", () => {
  expect(
    eventGrid(
      [
        {
          title: "Task",
          start: subMinutes(new Date(), 30), // 14th 23:30
        },
      ],

      "monday",
      new Date()
    ).grid
  ).toMatchInlineSnapshot(`
    [
      ,
      ,
      [
        ,
        ,
        ,
        ,
        [
          {
            "end": "2024-06-14 23:59",
            "index": 0,
            "start": "2024-06-14 23:30",
            "title": "Task",
          },
        ],
      ],
    ]
  `);
});

xtest("works with full day event", () => {
  expect(
    eventGrid(
      [
        {
          title: "Full day event",
          start: startOfDay(new Date()), // 15th 00:00
          end: endOfDay(new Date()), // 15th 23:59
        },
      ],

      "monday",
      new Date()
    ).grid
  ).toMatchInlineSnapshot(`
    [
      ,
      ,
      [
        ,
        ,
        ,
        ,
        ,
        [
          {
            "end": "2024-06-15 23:59",
            "index": 0,
            "start": "2024-06-15 00:00",
            "title": "Full day event",
          },
        ],
      ],
    ]
  `);
});

xtest("can populate the grid over multiple days", () => {
  expect(
    eventGrid(
      [
        {
          title: "3 days event",
          start: startOfDay(addDays(new Date(), 2)), // 17th 00:00
          end: endOfDay(addDays(new Date(), 4)), // 19th 23:59
          color: "pink",
        },
      ],

      "monday",
      new Date()
    ).grid
  ).toMatchInlineSnapshot(`
    [
      ,
      ,
      ,
      [
        [
          {
            "end": "2024-06-19 23:59",
            "index": 0,
            "start": "2024-06-17 00:00",
            "title": "3 days event",
          },
        ],
        [
          {
            "end": "2024-06-19 23:59",
            "index": 0,
            "start": "2024-06-17 00:00",
            "title": "3 days event",
          },
        ],
        [
          {
            "end": "2024-06-19 23:59",
            "index": 0,
            "start": "2024-06-17 00:00",
            "title": "3 days event",
          },
        ],
      ],
    ]
  `);

  // over 2 weeks
  expect(
    eventGrid(
      [
        {
          title: "3 day event",
          start: startOfDay(addDays(new Date(), 1)), // 16th 00:00
          end: endOfDay(addDays(new Date(), 3)), // 18th 23:59
          color: "pink",
        },
      ],

      "monday",
      new Date()
    ).grid
  ).toMatchInlineSnapshot(`
    [
      ,
      ,
      [
        ,
        ,
        ,
        ,
        ,
        ,
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
        ],
      ],
      [
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
        ],
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
        ],
      ],
    ]
  `);
});

xtest("works with overlaps", () => {
  expect(
    eventGrid(
      [
        {
          title: "3 day event",
          start: startOfDay(addDays(new Date(), 1)), // 16th 00:00
          end: endOfDay(addDays(new Date(), 3)), // 18th 23:59
          color: "pink",
        },
        {
          title: "3 day event overlapping",
          start: startOfDay(addDays(new Date(), 2)), // 17th 00:00
          end: endOfDay(addDays(new Date(), 4)), // 19th 23:59
          color: "pink",
        },
        // {
        //   title: "loong event",
        //   start: startOfDay(subWeeks(new Date(), 2)), // 1st 00:00
        //   end: endOfDay(addWeeks(new Date(), 2)), // 29th 23:59
        //   color: "pink",
        // },
      ],

      "monday",
      new Date()
    ).grid
  ).toMatchInlineSnapshot(`
    [
      ,
      ,
      [
        ,
        ,
        ,
        ,
        ,
        ,
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
        ],
      ],
      [
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
          {
            "end": "2024-06-19 23:59",
            "index": 1,
            "start": "2024-06-17 00:00",
            "title": "3 day event overlapping",
          },
        ],
        [
          {
            "end": "2024-06-18 23:59",
            "index": 0,
            "start": "2024-06-16 00:00",
            "title": "3 day event",
          },
          {
            "end": "2024-06-19 23:59",
            "index": 1,
            "start": "2024-06-17 00:00",
            "title": "3 day event overlapping",
          },
        ],
        [
          {
            "end": "2024-06-19 23:59",
            "index": 1,
            "start": "2024-06-17 00:00",
            "title": "3 day event overlapping",
          },
        ],
      ],
    ]
  `);
});

test("events are correct", () => {
  expect(
    eventGrid(
      [
        {
          title: "3 day event",
          start: startOfDay(addDays(new Date(), 1)), // 16th 00:00
          end: endOfDay(addDays(new Date(), 3)), // 18th 23:59
          color: "pink",
        },
      ],

      "monday",
      new Date()
    ).events
  ).toMatchInlineSnapshot(`
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
        "start": 2024-06-23T00:00:00.000Z,
      },
    ]
  `);
});
