import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { eventsFixture } from "./fixtures";
import { WeekCalendar } from "./week_calendar";
import { FlexCol } from "./components/wrappers";
import { useState } from "react";
// import DateRangeIcon from "@mui/icons-material/DateRange";
// import TodayIcon from "@mui/icons-material/Today";

export function CalendarEntry() {
  // const [calendarOptions, setCalendarOptions] = useState<string[]>([
  //   "monday",
  //   "workWeek",
  // ]);

  // const handleDefaultValues = (
  //   event: React.MouseEvent<HTMLElement>,
  //   newOptions: string[],
  // ) => {
  //   setCalendarOptions(newOptions);
  // };

  return (
    <>
      {/* <ToggleButtonGroup value={calendarOptions} onChange={handleDefaultValues}>
        <ToggleButton value="workWeek">
          <DateRangeIcon />
        </ToggleButton>
        <ToggleButton value="monday">
          <TodayIcon />
        </ToggleButton>
      </ToggleButtonGroup> */}
      <FlexCol width="100%" height="100%" p={4}>
        <Box>
          <Typography variant="h4">Many events</Typography>
          <WeekCalendar
            events={eventsFixture}
            // workWeek={calendarOptions.some((option) => option === "workWeek")}
            // startDay={
            //   calendarOptions.some((option) => option === "monday")
            //     ? "monday"
            //     : "sunday"
            // }
          />
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
    </>
  );
}
