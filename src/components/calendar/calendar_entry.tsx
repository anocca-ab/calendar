import { Box, Typography } from "@mui/material";
import { eventsFixture } from "./fixtures";
import { WeekCalendar } from "./week_calendar";
import { FlexCol } from "./components/wrappers";

export function CalendarEntry() {
  return (
    <FlexCol width="100%" height="100%" p={4}>
      <Box>
        <Typography variant="h4">Many events</Typography>
        <WeekCalendar events={eventsFixture} />
      </Box>

      <Box>
        <Typography variant="h4">A task</Typography>
        <WeekCalendar
          events={[
            {
              // id: "1",
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
    </FlexCol>
  );
}
