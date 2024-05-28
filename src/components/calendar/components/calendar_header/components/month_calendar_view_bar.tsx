import { Box, Divider, Typography } from "@mui/material";
import { addDays, format } from "date-fns";
import { useCalendar } from "../../../state_management/calendar_context";
import { FlexRow } from "../../wrappers";
import { ReactElement } from "react";

export function MonthCalendarViewBar() {
  const { workWeek, currentFirstDayOfTheWeek } = useCalendar();
  const daysInWeek = workWeek ? 5 : 7;

  const weekDays: ReactElement[] = [];
  [...Array(daysInWeek)].forEach((_, index) => {
    const dayOfWeek = format(addDays(currentFirstDayOfTheWeek, index), "EEE");
    weekDays.push(
      <FlexRow
        width="119px"
        height="20px"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="caption">{dayOfWeek}</Typography>
      </FlexRow>,
    );

    weekDays.push(
      <FlexRow
        sx={{
          position: "absolute",
          alignItems: "stretch",
          justifyContent: "flex-start",
          inset: 0,
          gap: "119px",
        }}
      >
        <Divider key={index} orientation="vertical" sx={{ width: "1px" }} />
      </FlexRow>,
    );
  });

  return (
    <Box pl="20px">
      <Box
        sx={{
          display: "flex",
          width: workWeek ? "600px" : "840px",
        }}
      >
        {weekDays}
      </Box>
    </Box>
  );
}
