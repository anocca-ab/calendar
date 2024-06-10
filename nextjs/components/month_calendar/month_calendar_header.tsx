import { ReactElement } from "react";
import { FlexCol, FlexRow } from "../wrappers";
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useMonthCalendar } from "./month_calendar";

export function MonthCalendarHeader() {
  return (
    <FlexCol width="100%">
      <CalendarLayoutBar />
      <MonthCalendarViewBar />
    </FlexCol>
  );
}

function MonthCalendarViewBar() {
  const { now, startDay } = useMonthCalendar();
  const currentFirstDayOfTheWeek = startOfWeek(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });
  // const daysInWeek = workWeek ? 5 : 7;
  const daysInWeek = 7;

  const weekDays: ReactElement[] = [];
  [...Array(daysInWeek)].forEach((_, index) => {
    const dayOfWeek = format(addDays(currentFirstDayOfTheWeek, index), "EEE");
    weekDays.push(
      <FlexRow
        key={`weekday-${index}`}
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
        key={`divider-${index}`}
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
          // width: workWeek ? "600px" : "840px",
          width: "840px",
        }}
      >
        {weekDays}
      </Box>
    </Box>
  );
}

const ChevronLeft = (props: React.ComponentProps<"svg">) => (
  <SvgIcon>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="black"
      viewBox="0 0 24 24"
      color="inherit"
      {...props}
    >
      <path
        fill="#000"
        fillOpacity={0.54}
        d="M15.705 7.41 14.295 6l-6 6 6 6 1.41-1.41-4.58-4.59 4.58-4.59Z"
      />
    </svg>
  </SvgIcon>
);

export function CalendarLayoutBar() {
  const { now, startDay } = useMonthCalendar();

  const currentFirstDayOfTheWeek = startOfWeek(now, {
    weekStartsOn: startDay === "monday" ? 1 : 0,
  });

  return (
    <FlexRow
      justifyContent="flex-start"
      px="22px"
      py="14px"
      gap={3}
      alignItems="center"
    >
      <Button
        variant="outlined"
        onClick={() => {
          // dispatch({
          //   type: "edit-currentFirstDayOfTheWeek",
          //   currentFirstDayOfTheWeek: startOfWeek(now, {
          //     weekStartsOn: startDay === "monday" ? 1 : 0,
          //   }),
          // });
        }}
      >
        Today
      </Button>
      <FlexRow>
        <IconButton
          onClick={() => {
            // dispatch({
            //   type: "edit-currentFirstDayOfTheWeek",
            //   currentFirstDayOfTheWeek: subWeeks(currentFirstDayOfTheWeek, 1),
            // });
          }}
        >
          <ChevronLeft />
        </IconButton>
        <IconButton
          onClick={() => {
            // dispatch({
            //   type: "edit-currentFirstDayOfTheWeek",
            //   currentFirstDayOfTheWeek: addWeeks(currentFirstDayOfTheWeek, 1),
            // });
          }}
        >
          <ChevronLeft style={{ transform: "rotate(180deg)" }} />
        </IconButton>
      </FlexRow>

      <MonthYearRowDate date={currentFirstDayOfTheWeek} />
      <WeekChip date={currentFirstDayOfTheWeek} />
    </FlexRow>
  );
}

function MonthYearRowDate({ date }: { date: Date }) {
  const monthYear = format(date, "MMM yyyy");

  return (
    <FlexRow width={106} height={32}>
      <Typography variant="h5">{monthYear}</Typography>
    </FlexRow>
  );
}

function WeekChip({ date }: { date: Date }) {
  const weekNr = format(date, "w");

  return <Chip label={`Week ${weekNr}`} sx={{ widht: 72, height: 32 }} />;
}
