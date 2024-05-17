import { Box } from "@mui/material";
import { addDays, startOfWeek } from "date-fns";
import { useCalendar } from "../../../state_management/week_calendar_context";
import { DayNumberStackDate } from "./day_number_stack_date";

export function CalendarWeekViewBar() {
  const { workWeek, today, startDay } = useCalendar();
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
