import { Box } from "@mui/material";
import { addDays } from "date-fns";
import { useCalendar } from "../../../state_management/calendar_context";
import { DayNumberStackDate } from "./day_number_stack_date";

export function WeekCalendarViewBar() {
  const { workWeek, currentFirstDayOfTheWeek } = useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const weekDays = [...Array(daysInWeek)].map((_, index) => (
    <DayNumberStackDate
      key={index}
      date={addDays(currentFirstDayOfTheWeek, index)}
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
