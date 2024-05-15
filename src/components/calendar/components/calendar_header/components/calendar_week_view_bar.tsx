import { Box } from "@mui/material";
import { DayNumberStackDate } from "./day_number_stack_date";
import { addDays } from "date-fns";

export function CalendarWeekViewBar() {
  const today = new Date();
  const fiveDays = [...Array(5)].map((_, index) => (
    <DayNumberStackDate key={index} date={addDays(today, index)} />
  ));

  return (
    <Box pl={8}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
        {fiveDays}
      </Box>
    </Box>
  );
}
