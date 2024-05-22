import { Box, Typography } from "@mui/material";
import { FlexCol } from "./components/wrappers";
import { eventsFixture } from "./fixtures";
import { Calendar } from "./calendar";

export function CalendarEntry() {
  return (
    <Box>
      <FlexCol width="100%" height="100%" p={4}>
        <Box>
          <Typography variant="h4">Many events</Typography>
          <Calendar variant="week" events={eventsFixture} />
        </Box>

        <Box>
          <Typography variant="h4">A task</Typography>
          <Calendar
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
          <Calendar events={eventsFixture} />
        </Box>
      </FlexCol>
    </Box>
  );
}
