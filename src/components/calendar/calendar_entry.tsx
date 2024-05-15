import { Box, Typography } from "@mui/material";
import { WeekCalendar } from "./week_calendar";
import { eventsFixture } from "./fixtures";
import { addDays } from "date-fns";

export function CalendarEntry() {
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      flexDirection={"column"}
      p={4}
    >
      <Box>
        <Typography variant="h4">Many events</Typography>
        <WeekCalendar events={eventsFixture} />
      </Box>

      <Box>
        <Typography variant="h4">A task</Typography>
        <WeekCalendar
          events={[
            {
              id: "1",
              title: "event",
              start: new Date(),
              color: "pink",
            },
          ]}
        />
      </Box>

      <Box>
        <Typography variant="h4">Many events</Typography>
        <WeekCalendar events={eventsFixture} />
      </Box>
    </Box>
  );
}
