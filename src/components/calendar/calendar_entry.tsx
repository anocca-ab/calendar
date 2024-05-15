import { Box } from "@mui/material";
import { WeekCalendar } from "./week_calendar";
import { eventsFixture } from "./fixtures";

export function CalendarEntry() {
  return (
    <Box width="100%" height="100%" display="flex" p={4}>
      <WeekCalendar events={eventsFixture} />
    </Box>
  );
}
