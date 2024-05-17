import { Box } from "@mui/material";
import { addDays, startOfWeek } from "date-fns";
import { StartDay } from "../../../types";
import { DayNumberStackDate } from "./day_number_stack_date";

export function CalendarWeekViewBar({
  today,
  workWeek,
  startDay,
}: {
  today: Date;
  workWeek: boolean;
  startDay: StartDay;
}) {
  const daysInWeek = workWeek ? 5 : 7;
  if (startDay === "monday") {
    const startingDateOfTheWeek = startOfWeek(today, { weekStartsOn: 1 });
    const weekDays = [...Array(daysInWeek)].map((_, index) => (
      <DayNumberStackDate
        key={index}
        date={addDays(startingDateOfTheWeek, index)}
      />
    ));

    return (
      <Box pl={8}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${daysInWeek}, 1fr)`,
          }}
        >
          {weekDays}
        </Box>
      </Box>
    );
  }

  const startingDateOfTheWeek = startOfWeek(today, { weekStartsOn: 0 });
  const weekDays = [...Array(daysInWeek)].map((_, index) => (
    <DayNumberStackDate
      key={index}
      date={addDays(startingDateOfTheWeek, index)}
    />
  ));

  return (
    <Box pl={8}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${daysInWeek}, 1fr)`,
        }}
      >
        {weekDays}
      </Box>
    </Box>
  );
}
