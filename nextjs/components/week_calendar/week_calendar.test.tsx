import { addDays, endOfDay, startOfDay, startOfWeek } from "date-fns";
import { getAllDayOverlaps } from "./event_overlap_functions";

jest.useFakeTimers().setSystemTime(new Date("2024-06-05"));

test("all day event overlapping", () => {
  const result = getAllDayOverlaps(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    7,
    [
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
    ],
  );
  expect(result).toMatchSnapshot();
});
