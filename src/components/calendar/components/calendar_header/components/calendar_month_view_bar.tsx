import { Box, Divider, Typography } from "@mui/material";
import { addDays, format } from "date-fns";
import { useCalendar } from "../../../state_management/calendar_context";
import { FlexRow } from "../../../components/wrappers";
import { ReactElement } from "react";

export function CalendarMonthViewBar() {
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
          alignSelf: "stretch",
          justifyContent: "flex-start",
          alignItems: "flex-end",
        }}
      >
        <Divider
          key={index}
          orientation="vertical"
          sx={
            {
              // opacity: workWeek && i === 5 ? 0 : !workWeek && i == 7 ? 0 : 1,
            }
          }
        />
      </FlexRow>,
    );
  });

  return (
    <Box pl="20px">
      <Box
        sx={{
          display: "flex",
        }}
      >
        {weekDays}
      </Box>
    </Box>
  );
}
