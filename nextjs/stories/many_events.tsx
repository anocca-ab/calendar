import { CalendarEvent } from "@/components/types";
import {
  addHours,
  startOfDay,
  startOfWeek,
  addDays,
  addMinutes,
  endOfDay,
  subDays,
} from "date-fns";

export const manyEvents: CalendarEvent[] = [
  {
    start: addHours(
      startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
      2
    ),
    title: "A full day task",
  },
  {
    start: addHours(
      startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
      2
    ),
    end: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 2),
    title: "A sub day task",
  },
  // 2 overlapping on monday
  {
    start: addHours(
      startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
      2
    ),
    end: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 4),
    title: "A two hour event",
  },
  {
    start: addHours(
      startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
      1
    ),
    end: addHours(startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })), 4),
    title: "A three hour event",
  },

  // 3 (+1) overlapping on tuesday
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      2
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      4
    ),
    title: "A two hour event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      1
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      4
    ),
    title: "A three hour event",
  },

  // 3 (+1) overlapping on tuesday
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      7
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      9
    ),
    title: "A two hour event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      6
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      9
    ),
    title: "A three hour event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      7
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      9
    ),
    title: "A one hour event",
  },

  // last event that overlapps all on tuesday
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      1
    ),
    end: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
      10
    ),
    title: "A big event",
  },
  // small events
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
      1
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
        1
      ),
      15
    ),
    title: "15 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      1
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        1
      ),
      5
    ),
    title: "5 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      2
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        2
      ),
      25
    ),
    title: "25 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      3
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        3
      ),
      30
    ),
    title: "30 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      4
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        4
      ),
      35
    ),
    title: "35 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      5
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        5
      ),
      45
    ),
    title: "45 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      6
    ),
    end: addMinutes(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        6
      ),
      60
    ),
    title: "60 min event",
  },
  {
    start: addHours(
      startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
      23
    ),
    end: addHours(
      addHours(
        startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
        23
      ),
      10
    ),
    canEdit: false,
    title: "over night event",
  },
  // full day events
  {
    start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
    end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 1)),
    title: "A two day event",
  },
  {
    start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
    end: endOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
    title: "All day event",
  },
  {
    start: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
    end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
    title: "A three day event",
  },
  {
    start: startOfDay(subDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 2)),
    end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 14)),
    title: "A loong day event",
  },
  {
    start: startOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
    end: endOfDay(addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), 3)),
    title: "All day event",
  },
].map((ev) => ({ ...ev, canEdit: ev.canEdit === false ? false : true }));
